import { randomUUID } from 'node:crypto';
import {
  AppealReason,
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
  type FinalGuessEntry,
  type JoinSuccess,
  type PlayerView,
  type QuestionEntry,
  type RoomSnapshot,
} from '@guess-table/shared';
import * as gameLog from '../db/gameLogRepository.js';

const APPEAL_LOCK_MIN_ATTEMPTS = 3;
const APPEAL_LOCK_MAX_UPHELD_RATE = 0.5;
const APPEAL_DUPLICATE_SIMILARITY_THRESHOLD = 0.5;
const OPEN_QUESTION_WORDS = ['как', 'что', 'кто', 'какой', 'какая', 'какое', 'какие', 'где', 'когда', 'почему', 'сколько', 'зачем'];

function wordsOf(text: string): Set<string> {
  return new Set(normalizeQuestion(text).split(' ').filter(Boolean));
}

/** Overlap coefficient (shared words / smaller word-set size) — lenient on purpose, short questions differ by a word or two even when they mean the same thing. */
function wordOverlapRatio(a: string, b: string): number {
  const wordsA = wordsOf(a);
  const wordsB = wordsOf(b);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let shared = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) shared += 1;
  }
  return shared / Math.min(wordsA.size, wordsB.size);
}

/** Crude heuristic: "как/что/кто/где/..." without "ли" usually means it isn't answerable with a plain да/нет. */
function looksLikeOpenQuestion(text: string): boolean {
  const words = wordsOf(text);
  if (words.has('ли')) return false;
  return OPEN_QUESTION_WORDS.some((word) => words.has(word));
}

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
  private finalGuesses: FinalGuessEntry[] = [];
  private winnerId: string | null = null;
  private revealedSecrets: Record<string, string> | null = null;
  private rematchReadyPlayerIds = new Set<string>();
  private appealLockedPlayerIds = new Set<string>();
  private appealStats = new Map<string, { total: number; upheld: number }>();
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

  /** Only the lone host, and only before a second player has joined, can cancel the room outright. */
  canLeaveLobby(playerId: string): Ack<null> {
    if (this.phase !== Phase.Lobby) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'Выйти можно только из лобби, пока не начата партия.') };
    }
    if (this.players[0]?.id !== playerId) {
      return { ok: false, error: err(ERROR_CODES.INVALID_TOKEN, 'Игрок не найден в комнате.') };
    }
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
    gameLog.recordQuestionAnswered(this.gameDbId, questionId, answer);

    // Turns alternate: whoever just answered asks next.
    this.currentTurnPlayerId = playerId;
    return { ok: true, data: null };
  }

  /**
   * An appeal voids the pending question instead of answering it — no server-verifiable
   * ground truth exists for "was this appeal justified", so we approximate: a Duplicate
   * appeal is upheld only if the question actually overlaps an earlier one, an Invalid
   * appeal only if the question doesn't read like a да/нет question at all. Players who
   * rack up mostly-rejected appeals lose access to the button for the rest of the game.
   */
  private isAppealUpheld(reason: AppealReason, questionText: string, questionId: string): boolean {
    if (reason === AppealReason.Duplicate) {
      return this.questions.some(
        (q) => q.id !== questionId && wordOverlapRatio(q.text, questionText) >= APPEAL_DUPLICATE_SIMILARITY_THRESHOLD
      );
    }
    return looksLikeOpenQuestion(questionText);
  }

  appealQuestion(playerId: string, questionId: string, reason: AppealReason): Ack<null> {
    this.touch();
    if (this.phase !== Phase.Playing) {
      return { ok: false, error: err(ERROR_CODES.INVALID_PHASE, 'Сейчас нельзя подать аппеляцию.') };
    }
    if (!this.pendingQuestion || this.pendingQuestion.id !== questionId) {
      return { ok: false, error: err(ERROR_CODES.NO_PENDING_QUESTION, 'Нет вопроса, ожидающего ответа.') };
    }
    if (this.pendingQuestion.authorId === playerId) {
      return { ok: false, error: err(ERROR_CODES.NOT_RECIPIENT, 'Подать аппеляцию может только тот, кому задали вопрос.') };
    }
    if (this.appealLockedPlayerIds.has(playerId)) {
      return {
        ok: false,
        error: err(ERROR_CODES.APPEAL_LOCKED, 'Функция аппеляции отключена для вас из-за частых необоснованных аппеляций.'),
      };
    }

    const question = this.pendingQuestion;
    const upheld = this.isAppealUpheld(reason, question.text, question.id);
    question.appeal = { reason, upheld };
    this.pendingQuestion = null;
    // Turn deliberately stays with the asker (currentTurnPlayerId untouched) — an appeal
    // means this exchange never happened, not that the appellant earns the next turn.

    const stats = this.appealStats.get(playerId) ?? { total: 0, upheld: 0 };
    stats.total += 1;
    if (upheld) stats.upheld += 1;
    this.appealStats.set(playerId, stats);
    if (stats.total >= APPEAL_LOCK_MIN_ATTEMPTS && stats.upheld / stats.total < APPEAL_LOCK_MAX_UPHELD_RATE) {
      this.appealLockedPlayerIds.add(playerId);
    }

    const appellant = this.findById(playerId);
    if (appellant) {
      gameLog.recordAppeal(randomUUID(), this.gameDbId, question.id, appellant.clientId, reason, upheld);
    }

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
    this.finalGuesses.push({ id: randomUUID(), authorId: playerId, cardId, correct, createdAt: Date.now() });
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
    this.finalGuesses = [];
    this.winnerId = null;
    this.revealedSecrets = null;
    this.rematchReadyPlayerIds.clear();
    this.appealLockedPlayerIds.clear();
    this.appealStats.clear();

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
      finalGuesses: this.finalGuesses,
      winnerId: this.winnerId,
      revealedSecrets: this.revealedSecrets,
      mySecretCardId: me?.secretCardId ?? null,
      rematchReadyPlayerIds: [...this.rematchReadyPlayerIds],
      appealLockedPlayerIds: [...this.appealLockedPlayerIds],
    };
  }

  socketIdFor(playerId: string): string | null {
    return this.findById(playerId)?.socketId ?? null;
  }

  allPlayerIds(): string[] {
    return this.players.map((p) => p.id);
  }
}
