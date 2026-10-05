export enum Phase {
  Lobby = 'lobby',
  Selecting = 'selecting',
  Playing = 'playing',
  Finished = 'finished',
}

export enum DeckId {
  Fictional = 'fictional',
  Celebrities = 'celebrities',
  Animals = 'animals',
  Professions = 'professions',
  Movies = 'movies',
  VideoGames = 'videoGames',
  Actors = 'actors',
}

export interface Card {
  id: string;
  displayName: string;
}

export enum AppealReason {
  Duplicate = 'duplicate',
  Invalid = 'invalid',
}

export const APPEAL_REASON_LABELS: Record<AppealReason, string> = {
  [AppealReason.Duplicate]: 'Такой вопрос уже был',
  [AppealReason.Invalid]: 'Вопрос некорректен',
};

export interface PlayerView {
  id: string;
  name: string;
  connected: boolean;
  hasSelectedSecret: boolean;
}

export interface QuestionEntry {
  id: string;
  authorId: string;
  text: string;
  answer: boolean | null;
  createdAt: number;
  /** Set once the recipient appeals instead of answering — the question is then never answered. */
  appeal?: { reason: AppealReason; upheld: boolean };
}

export interface FinalGuessEntry {
  id: string;
  authorId: string;
  cardId: string;
  correct: boolean;
  createdAt: number;
}

export interface RoomSnapshot {
  roomId: string;
  phase: Phase;
  deckId: DeckId;
  players: PlayerView[];
  boardOrder: string[];
  currentTurnPlayerId: string | null;
  pendingQuestionId: string | null;
  questions: QuestionEntry[];
  finalGuesses: FinalGuessEntry[];
  winnerId: string | null;
  revealedSecrets: Record<string, string> | null;
  /** The secret card id belonging to the recipient of this snapshot (never the opponent's). */
  mySecretCardId: string | null;
  /** Ids of players who have asked for a rematch in the current (finished) game. */
  rematchReadyPlayerIds: string[];
  /** Ids of players whose appeal button is disabled for the rest of this game (too many unjustified appeals). */
  appealLockedPlayerIds: string[];
}

export interface JoinSuccess {
  playerId: string;
  playerToken: string;
  snapshot: RoomSnapshot;
}

export interface ErrorPayload {
  code: string;
  message: string;
}
