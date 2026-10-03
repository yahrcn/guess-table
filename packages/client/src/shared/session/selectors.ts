import type { SessionState } from './types';

export interface WithSession {
  session: SessionState;
}

export const getSessionRoot = (state: WithSession): SessionState => state.session;

export const selectConnectionStatus = (state: WithSession) => getSessionRoot(state).status;
export const selectPlayerId = (state: WithSession) => getSessionRoot(state).playerId;
export const selectPlayerToken = (state: WithSession) => getSessionRoot(state).playerToken;
export const selectSessionRoomId = (state: WithSession) => getSessionRoot(state).roomId;
export const selectPlayerName = (state: WithSession) => getSessionRoot(state).playerName;
