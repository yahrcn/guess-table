import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createSessionState } from './factories';
import { ConnectionStatus } from './types';

const slice = createSlice({
  name: 'session',
  initialState: createSessionState(),
  reducers: {
    connectionStatusChanged(state, action: PayloadAction<{ status: ConnectionStatus }>) {
      state.status = action.payload.status;
    },
    sessionEstablished(
      state,
      action: PayloadAction<{ playerId: string; playerToken: string; roomId: string; playerName: string }>
    ) {
      state.playerId = action.payload.playerId;
      state.playerToken = action.payload.playerToken;
      state.roomId = action.payload.roomId;
      state.playerName = action.payload.playerName;
    },
    playerNameChanged(state, action: PayloadAction<{ playerName: string }>) {
      state.playerName = action.payload.playerName;
    },
  },
});

export const sessionActions = slice.actions;
export const sessionReducer = slice.reducer;
