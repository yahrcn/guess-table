import { loadPlayerName } from '../helpers/storageHelpers';
import { ConnectionStatus, type SessionState } from './types';

export function createSessionState(model?: Partial<SessionState>): SessionState {
  return {
    status: ConnectionStatus.Idle,
    playerId: null,
    playerToken: null,
    roomId: null,
    playerName: loadPlayerName(),
    ...model,
  };
}
