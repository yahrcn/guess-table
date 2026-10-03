export enum Phase {
  Lobby = 'lobby',
  Selecting = 'selecting',
  Playing = 'playing',
  Finished = 'finished',
}

export interface Card {
  id: string;
  displayName: string;
  seed: string;
}

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
}

export interface RoomSnapshot {
  roomId: string;
  phase: Phase;
  players: PlayerView[];
  boardOrder: string[];
  currentTurnPlayerId: string | null;
  pendingQuestionId: string | null;
  questions: QuestionEntry[];
  winnerId: string | null;
  revealedSecrets: Record<string, string> | null;
  /** The secret card id belonging to the recipient of this snapshot (never the opponent's). */
  mySecretCardId: string | null;
  /** Ids of players who have asked for a rematch in the current (finished) game. */
  rematchReadyPlayerIds: string[];
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
