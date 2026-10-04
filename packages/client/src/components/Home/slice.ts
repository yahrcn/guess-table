import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AsyncStatus } from '../../shared/types';
import { createHomeState } from './factories';

const slice = createSlice({
  name: 'home',
  initialState: createHomeState(),
  reducers: {
    createRoomBegin(state, _action: PayloadAction<{ playerName: string }>) {
      state.createStatus = AsyncStatus.Pending;
      state.createError = null;
    },
    createRoomSuccess(state, action: PayloadAction<{ roomId: string }>) {
      state.createStatus = AsyncStatus.Succeeded;
      state.createdRoomId = action.payload.roomId;
    },
    createRoomError(state, action: PayloadAction<{ message: string }>) {
      state.createStatus = AsyncStatus.Failed;
      state.createError = action.payload.message;
    },
    // Consumes the one-time "just created a room, navigate there" signal — without this,
    // createStatus stays Succeeded forever, so navigating back to "/" later (e.g. the
    // "На главную" button after the game ends) would immediately redirect right back
    // into that same now-finished room.
    createRoomRedirected(state) {
      state.createStatus = AsyncStatus.Idle;
      state.createdRoomId = null;
    },
  },
});

export const homeActions = slice.actions;
export const homeReducer = slice.reducer;
