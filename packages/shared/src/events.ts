import type { DeckId, ErrorPayload, JoinSuccess, RoomSnapshot } from './types.js';

export interface AckOk<T> {
  ok: true;
  data: T;
}

export interface AckError {
  ok: false;
  error: ErrorPayload;
}

export type Ack<T> = AckOk<T> | AckError;

export interface ClientToServerEvents {
  'room:create': (
    payload: { playerName: string; clientId: string },
    cb: (ack: Ack<JoinSuccess & { roomId: string }>) => void
  ) => void;
  'room:join': (
    payload: { roomId: string; playerName: string; playerToken?: string; clientId: string },
    cb: (ack: Ack<JoinSuccess & { roomId: string }>) => void
  ) => void;
  'game:selectSecret': (
    payload: { cardId: string },
    cb: (ack: Ack<null>) => void
  ) => void;
  'game:askQuestion': (
    payload: { text: string },
    cb: (ack: Ack<null>) => void
  ) => void;
  'game:answerQuestion': (
    payload: { questionId: string; answer: boolean },
    cb: (ack: Ack<null>) => void
  ) => void;
  'game:finalGuess': (
    payload: { cardId: string },
    cb: (ack: Ack<{ correct: boolean }>) => void
  ) => void;
  'game:rematchBegin': (cb: (ack: Ack<null>) => void) => void;
  'game:selectDeck': (
    payload: { deckId: DeckId },
    cb: (ack: Ack<null>) => void
  ) => void;
}

export interface ServerToClientEvents {
  'room:state': (snapshot: RoomSnapshot) => void;
  'room:fatal': (error: ErrorPayload) => void;
}

export const ERROR_CODES = {
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVALID_PHASE: 'INVALID_PHASE',
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',
  NOT_RECIPIENT: 'NOT_RECIPIENT',
  DUPLICATE_QUESTION: 'DUPLICATE_QUESTION',
  INVALID_CARD: 'INVALID_CARD',
  ALREADY_SELECTED: 'ALREADY_SELECTED',
  NO_PENDING_QUESTION: 'NO_PENDING_QUESTION',
  EMPTY_QUESTION: 'EMPTY_QUESTION',
  NOT_HOST: 'NOT_HOST',
  INVALID_DECK: 'INVALID_DECK',
} as const;
