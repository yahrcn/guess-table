import { io, type Socket } from 'socket.io-client';
import type {
  Ack,
  AppealReason,
  ClientToServerEvents,
  DeckId,
  JoinSuccess,
  ServerToClientEvents,
} from '@guess-table/shared';
import { loadOrCreateClientId } from '../helpers/storageHelpers';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

/** Same-origin in both dev (via Vite proxy) and production (server serves the built client). */
export function getSocket(): AppSocket {
  if (!socket) {
    socket = io({ autoConnect: true, transports: ['websocket', 'polling'] });
  }
  return socket;
}

type RoomJoinAck = Ack<JoinSuccess & { roomId: string }>;

export function createRoom(playerName: string): Promise<RoomJoinAck> {
  return new Promise((resolve) => {
    getSocket().emit('room:create', { playerName, clientId: loadOrCreateClientId() }, resolve);
  });
}

export function joinRoom(roomId: string, playerName: string, playerToken?: string): Promise<RoomJoinAck> {
  return new Promise((resolve) => {
    getSocket().emit('room:join', { roomId, playerName, playerToken, clientId: loadOrCreateClientId() }, resolve);
  });
}

export function selectSecret(cardId: string): Promise<Ack<null>> {
  return new Promise((resolve) => {
    getSocket().emit('game:selectSecret', { cardId }, resolve);
  });
}

export function askQuestion(text: string): Promise<Ack<null>> {
  return new Promise((resolve) => {
    getSocket().emit('game:askQuestion', { text }, resolve);
  });
}

export function answerQuestion(questionId: string, answer: boolean): Promise<Ack<null>> {
  return new Promise((resolve) => {
    getSocket().emit('game:answerQuestion', { questionId, answer }, resolve);
  });
}

export function appealQuestion(questionId: string, reason: AppealReason): Promise<Ack<null>> {
  return new Promise((resolve) => {
    getSocket().emit('game:appealQuestion', { questionId, reason }, resolve);
  });
}

export function finalGuess(cardId: string): Promise<Ack<{ correct: boolean }>> {
  return new Promise((resolve) => {
    getSocket().emit('game:finalGuess', { cardId }, resolve);
  });
}

export function rematchBegin(): Promise<Ack<null>> {
  return new Promise((resolve) => {
    getSocket().emit('game:rematchBegin', resolve);
  });
}

export function leaveLobby(): Promise<Ack<null>> {
  return new Promise((resolve) => {
    getSocket().emit('room:leave', resolve);
  });
}

export function selectDeck(deckId: DeckId): Promise<Ack<null>> {
  return new Promise((resolve) => {
    getSocket().emit('game:selectDeck', { deckId }, resolve);
  });
}
