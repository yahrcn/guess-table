import { randomUUID } from 'node:crypto';
import {
  BOARD_SIZE,
  DEFAULT_DECK_ID,
  ERROR_CODES,
  Phase,
  getDeckCards,
  isValidDeckId,
  normalizeQuestion,
  type Ack,
  type DeckId,
  type ErrorPayload,
  type JoinSuccess,
  type PlayerView,
  type QuestionEntry,
  type RoomSnapshot,
} from '@guess-table/shared';
import * as gameLog from '../db/gameLogRepository.js';

interface InternalPlayer {
  id: string;
  token: string;
  name: string;
  socketId: string | null;
  connected: boolean;
  secretCardId: string | null;
  /** Stable anonymous id from the player's browser localStorage — analytics only, never sent to the opponent. */
  clientId: string;
}

const MAX_PLAYERS = 2;
const ROOM_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_NAME_LENGTH = 30;
const MAX_QUESTION_LENGTH = 200;

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function err(code: string, message: string): ErrorPayload {
  return { code, message };
}

export class Room {
  readonly id: string;
  private players: InternalPlayer[] = [];
  private phase: Phase = Phase.Lobby;
  private deckId: DeckId = DEFAULT_DECK_ID;
  private boardOrder: string[];
  private currentTurnPlayerId: string | null = null;
  private pendingQuestion: QuestionEntry | null = null;
  private questions: QuestionEntry[] = [];
  private winnerId: string | null = null;
  private revealedSecrets: Record<string, string> | null = null;
  private rematchReadyPlayerIds = new Set<string>();
  private lastActivity = Date.now();
  /** Row id in the `games` analytics table for the game currently being played in this room. */
  private gameDbId: string;

  constructor(id: string) {
    this.id = id;
    this.boardOrder = this.drawBoardOrder();
    this.gameDbId = randomUUID();
    gameLog.recordGameCreated(this.gameDbId, this.id, this.deckId);
  }

  /** 25 cards drawn at random out of the chosen deck's full 50. */
  private drawBoardOrder(): string[] {
    return shuffle(getDeckCards(this.deckId).map((c) => c.id)).slice(0, BOARD_SIZE);
  }

  private touch() {
    this.lastActivity = Date.now();
  }

  isExpired(): boolean {
    return Date.now() - this.lastActivity > ROOM_TTL_MS;
  }

  private findByToken(token: string): InternalPlayer | undefined {
    return this.players.find((p) => p.token === token);
  }

  private findById(id: string): InternalPlayer | undefined {
    return this.players.find((p) => p.id === id);
  }

  join(playerName: string, socketId: string, clientId: string, token?: string): Ack<JoinSuccess> {
    this.touch();

    if (token) {
      const existing = this.findByToken(token);
      if (!existing) {
        return { ok: false, error: err(ERROR_CODES.INVALID_TOKEN, 'Сессия не найдена, откройте ссылку на комнату заново.') };
      }
      existing.socketId = socketId;
      existing.connected = true;
      const trimmedName = playerName.trim();
      if (trimmedName) existing.name = trimmedName.slice(0, MAX_NAME_LENGTH);
      gameLog.recordPlayerJoined(this.gameDbId, existing.clientId, existing.name, this.players[0] === existing);
      return {
        ok: true,
        data: { playerId: existing.id, playerToken: existing.token, snapshot: this.snapshotFor(existing.id) },
      };
    }

    if (this.players.length >= MAX_PLAYERS) {
      return { ok: false, error: err(ERROR_CODES.ROOM_FULL, 'В этой комнате уже два игрока.') };
    }

    const player: InternalPlayer = {
      id: randomUUID(),
      token: randomUUID(),
      name: playerName.trim().slice(0, MAX_NAME_LENGTH) || `Игрок ${this.players.length + 1}`,
      socketId,
      connected: true,
      secretCardId: null,
      clientId,
    };
    const isCreator = this.players.length === 0;
    this.players.push(player);
    gameLog.recordPlayerJoined(this.gameDbId, player.clientId, player.name, isCreator);

    if (this.players.length === MAX_PLAYERS) {
      this.phase = Phase.Selecting;
    }

    return { ok: true, data: { playerId: player.id, playerToken: player.token, snapshot: this.snapshotFor(player.id) } };
  }

  /**
   * Only the host (first player, by definition the only one present while still in
   * Lobby — the phase flips to Selecting the instant a second player joins) can swap
   * the deck, and only before the game actually starts.
   */
  selectDeck(playerId: string, deckId: string): Ack<null> {
    this.touch();
    if (this.phase !== Phase.Lobby) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'Набор карточек можно сменить только до начала игры.') };
    }
    if (this.players[0]?.id !== playerId) {
      return { ok: false, error: err(ERROR_CODES.NOT_HOST, 'Набор карточек выбирает создатель комнаты.') };
    }
    if (!isValidDeckId(deckId)) {
      return { ok: false, error: err(ERROR_CODES.INVALID_DECK, 'Такого набора карточек не существует.') };
    }
    this.deckId = deckId;
    this.boardOrder = this.drawBoardOrder();
    gameLog.recordGameDeckChanged(this.gameDbId, this.deckId);
    return { ok: true, data: null };
  }

  markDisconnected(socketId: string): void {
    const player = this.players.find((p) => p.socketId === socketId);
    if (player) {
      player.connected = false;
      player.socketId = null;
      this.touch();
    }
  }

  selectSecret(playerId: string, cardId: string): Ack<null> {
    this.touch();
    if (this.phase !== Phase.Selecting) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'Сейчас нельзя выбрать карточку.') };
    }
    const player = this.findById(playerId);
    if (!player) return { ok: false, error: err(ERROR_CODES.INVALID_TOKEN, 'Игрок не найден в комнате.') };
    if (player.secretCardId) {
      return { ok: false, error: err(ERROR_CODES.ALREADY_SELECTED, 'Вы уже выбрали карточку.') };
    }
    if (!this.boardOrder.includes(cardId)) {
      return { ok: false, error: err(ERROR_CODES.INVALID_CARD, 'Такой карточки нет на поле.') };
    }
    player.secretCardId = cardId;

    if (this.players.length === MAX_PLAYERS && this.players.every((p) => p.secretCardId)) {
      this.phase = Phase.Playing;
      this.currentTurnPlayerId = shuffle(this.players)[0]!.id;
      gameLog.recordGameStarted(this.gameDbId);
    }
    return { ok: true, data: null };
  }

  askQuestion(playerId: string, text: string): Ack<null> {
    this.touch();
    if (this.phase !== Phase.Playing) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'Игра ещё не началась или уже закончилась.') };
    }
    if (this.currentTurnPlayerId !== playerId) {
      return { ok: false, error: err(ERROR_CODES.NOT_YOUR_TURN, 'Сейчас не ваш ход.') };
    }
    if (this.pendingQuestion) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'Дождитесь ответа на предыдущий вопрос.') };
    }
    const trimmed = text.trim();
    if (!trimmed) {
      return { ok: false, error: err(ERROR_CODES.EMPTY_QUESTION, 'Вопрос не может быть пустым.') };
    }
    const normalized = normalizeQuestion(trimmed);
    const isDuplicate = this.questions.some((q) => normalizeQuestion(q.text) === normalized);
    if (isDuplicate) {
      return { ok: false, error: err(ERROR_CODES.DUPLICATE_QUESTION, 'Такой вопрос уже задавали в этой партии.') };
    }

    const question: QuestionEntry = {
      id: randomUUID(),
      authorId: playerId,
      text: trimmed.slice(0, MAX_QUESTION_LENGTH),
      answer: null,
      createdAt: Date.now(),
    };
    this.pendingQuestion = question;
    this.questions.push(question);
    const author = this.findById(playerId);
    if (author) {
      gameLog.recordQuestionAsked(question.id, this.gameDbId, author.clientId, question.text, normalized);
    }
    return { ok: true, data: null };
  }

  answerQuestion(playerId: string, questionId: string, answer: boolean): Ack<null> {
    this.touch();
    if (!this.pendingQuestion || this.pendingQuestion.id !== questionId) {
      return { ok: false, error: err(ERROR_CODES.NO_PENDING_QUESTION, 'Нет вопроса, ожидающего ответа.') };
    }
    if (this.pendingQuestion.authorId === playerId) {
      return { ok: false, error: err(ERROR_CODES.NOT_RECIPIENT, 'Отвечать должен соперник, задавший вопрос не может отвечать сам себе.') };
    }
    this.pendingQuestion.answer = answer;
    this.pendingQuestion = null;
    gameLog.recordQuestionAnswered(questionId, answer);

    // Turns alternate: whoever just answered asks next.
    this.currentTurnPlayerId = playerId;
    return { ok: true, data: null };
  }

  finalGuess(playerId: string, cardId: string): Ack<{ correct: boolean }> {
    this.touch();
    if (this.phase !== Phase.Playing) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'Сейчас нельзя делать финальную догадку.') };
    }
    if (this.currentTurnPlayerId !== playerId) {
      return { ok: false, error: err(ERROR_CODES.NOT_YOUR_TURN, 'Сейчас не ваш ход.') };
    }
    if (this.pendingQuestion) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'Дождитесь ответа на предыдущий вопрос.') };
    }
    if (!this.boardOrder.includes(cardId)) {
      return { ok: false, error: err(ERROR_CODES.INVALID_CARD, 'Такой карточки нет на поле.') };
    }
    const opponent = this.players.find((p) => p.id !== playerId);
    if (!opponent?.secretCardId) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'У соперника ещё нет загаданной карточки.') };
    }

    const correct = opponent.secretCardId === cardId;
    if (correct) {
      this.phase = Phase.Finished;
      this.winnerId = playerId;
      this.revealedSecrets = {};
      for (const p of this.players) {
        if (p.secretCardId) this.revealedSecrets[p.id] = p.secretCardId;
      }
      const winner = this.findById(playerId);
      if (winner) gameLog.recordGameFinished(this.gameDbId, winner.clientId);
    } else {
      // Wrong guess doesn't end the game — it just costs the guesser their turn.
      this.currentTurnPlayerId = opponent.id;
    }
    return { ok: true, data: { correct } };
  }

  requestRematch(playerId: string): Ack<null> {
    this.touch();
    if (this.phase !== Phase.Finished) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'Реванш можно начать только после завершения партии.') };
    }
    if (!this.findById(playerId)) {
      return { ok: false, error: err(ERROR_CODES.INVALID_TOKEN, 'Игрок не найден в комнате.') };
    }
    this.rematchReadyPlayerIds.add(playerId);

    const everyoneReady =
      this.players.length === MAX_PLAYERS && this.players.every((p) => this.rematchReadyPlayerIds.has(p.id));
    if (everyoneReady) {
      this.resetForRematch();
    }
    return { ok: true, data: null };
  }

  private resetForRematch(): void {
    this.boardOrder = this.drawBoardOrder();
    for (const p of this.players) {
      p.secretCardId = null;
    }
    this.phase = Phase.Selecting;
    this.currentTurnPlayerId = null;
    this.pendingQuestion = null;
    this.questions = [];
    this.winnerId = null;
    this.revealedSecrets = null;
    this.rematchReadyPlayerIds.clear();

    // A rematch is a new game row sharing the same room — lets "games played" count each
    // round while "games_log.room_id" still ties them back to one shared room/link.
    this.gameDbId = randomUUID();
    gameLog.recordGameCreated(this.gameDbId, this.id, this.deckId);
    this.players.forEach((p, index) => gameLog.recordPlayerJoined(this.gameDbId, p.clientId, p.name, index === 0));
  }

  snapshotFor(playerId: string): RoomSnapshot {
    const players: PlayerView[] = this.players.map((p) => ({
      id: p.id,
      name: p.name,
      connected: p.connected,
      hasSelectedSecret: Boolean(p.secretCardId),
    }));
    const me = this.findById(playerId);
    return {
      roomId: this.id,
      phase: this.phase,
      deckId: this.deckId,
      players,
      boardOrder: this.boardOrder,
      currentTurnPlayerId: this.currentTurnPlayerId,
      pendingQuestionId: this.pendingQuestion?.id ?? null,
      questions: this.questions,
      winnerId: this.winnerId,
      revealedSecrets: this.revealedSecrets,
      mySecretCardId: me?.secretCardId ?? null,
      rematchReadyPlayerIds: [...this.rematchReadyPlayerIds],
    };
  }

  socketIdFor(playerId: string): string | null {
    return this.findById(playerId)?.socketId ?? null;
  }

  allPlayerIds(): string[] {
    return this.players.map((p) => p.id);
  }
}
