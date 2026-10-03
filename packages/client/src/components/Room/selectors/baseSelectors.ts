import type { RoomState } from '../types';

export interface WithRoom {
  room: RoomState;
}

export const getRoomRoot = (state: WithRoom): RoomState => state.room;

export const selectRoomSnapshot = (state: WithRoom) => getRoomRoot(state).snapshot;
export const selectJoinStatus = (state: WithRoom) => getRoomRoot(state).joinStatus;
export const selectJoinError = (state: WithRoom) => getRoomRoot(state).joinError;
export const selectIsSubmitting = (state: WithRoom) => getRoomRoot(state).isSubmitting;
export const selectActionError = (state: WithRoom) => getRoomRoot(state).actionError;
export const selectGuessMode = (state: WithRoom) => getRoomRoot(state).guessMode;
export const selectExcludedCardIds = (state: WithRoom) => getRoomRoot(state).excludedCardIds;
export const selectRuledOutCardIds = (state: WithRoom) => getRoomRoot(state).ruledOutCardIds;
