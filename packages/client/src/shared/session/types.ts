export enum ConnectionStatus {
  Idle = 'idle',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Error = 'error',
}

export interface SessionState {
  status: ConnectionStatus;
  playerId: string | null;
  playerToken: string | null;
  roomId: string | null;
  playerName: string;
}
