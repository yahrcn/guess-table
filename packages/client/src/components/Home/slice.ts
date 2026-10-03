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
  },
});

export const homeActions = slice.actions;
export const homeReducer = slice.reducer;
