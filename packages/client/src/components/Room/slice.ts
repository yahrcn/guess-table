import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Phase, type RoomSnapshot } from '@guess-table/shared';
import { AsyncStatus } from '../../shared/types';
import { createRoomState } from './factories';

const slice = createSlice({
  name: 'room',
  initialState: createRoomState(),
  reducers: {
    joinRoomBegin(state, _action: PayloadAction<{ roomId: string; playerName: string }>) {
      state.joinStatus = AsyncStatus.Pending;
      state.joinError = null;
    },
    joinRoomError(state, action: PayloadAction<{ message: string }>) {
      state.joinStatus = AsyncStatus.Failed;
      state.joinError = action.payload.message;
    },
    roomSnapshotReceived(state, action: PayloadAction<{ snapshot: RoomSnapshot }>) {
      const previousPhase = state.snapshot?.phase;
      state.snapshot = action.payload.snapshot;
      state.joinStatus = AsyncStatus.Succeeded;
      state.joinError = null;
      // A rematch resets the same room from Finished back to Selecting — old exclusion
      // marks from the previous game no longer apply to the new one.
      if (previousPhase === Phase.Finished && action.payload.snapshot.phase === Phase.Selecting) {
        state.excludedCardIds = [];
        state.ruledOutCardIds = [];
      }
    },
    excludedCardIdsLoaded(state, action: PayloadAction<{ cardIds: string[] }>) {
      state.excludedCardIds = action.payload.cardIds;
    },
    cardExclusionToggled(state, action: PayloadAction<{ cardId: string }>) {
      if (state.ruledOutCardIds.includes(action.payload.cardId)) return;
      const index = state.excludedCardIds.indexOf(action.payload.cardId);
      if (index >= 0) {
        state.excludedCardIds.splice(index, 1);
      } else {
        state.excludedCardIds.push(action.payload.cardId);
      }
    },
    ruledOutCardIdsLoaded(state, action: PayloadAction<{ cardIds: string[] }>) {
      state.ruledOutCardIds = action.payload.cardIds;
    },
    guessModeToggled(state) {
      state.guessMode = !state.guessMode;
    },
    selectSecretBegin(state, _action: PayloadAction<{ cardId: string }>) {
      state.isSubmitting = true;
      state.actionError = null;
    },
    selectSecretSuccess(state) {
      state.isSubmitting = false;
    },
    selectSecretError(state, action: PayloadAction<{ message: string }>) {
      state.isSubmitting = false;
      state.actionError = action.payload.message;
    },
    askQuestionBegin(state, _action: PayloadAction<{ text: string }>) {
      state.isSubmitting = true;
      state.actionError = null;
    },
    askQuestionSuccess(state) {
      state.isSubmitting = false;
    },
    askQuestionError(state, action: PayloadAction<{ message: string }>) {
      state.isSubmitting = false;
      state.actionError = action.payload.message;
    },
    answerQuestionBegin(state, _action: PayloadAction<{ questionId: string; answer: boolean }>) {
      state.isSubmitting = true;
      state.actionError = null;
    },
    answerQuestionSuccess(state) {
      state.isSubmitting = false;
    },
    answerQuestionError(state, action: PayloadAction<{ message: string }>) {
      state.isSubmitting = false;
      state.actionError = action.payload.message;
    },
    finalGuessBegin(state, _action: PayloadAction<{ cardId: string }>) {
      state.isSubmitting = true;
      state.actionError = null;
    },
    finalGuessSuccess(state, action: PayloadAction<{ cardId: string; correct: boolean }>) {
      state.isSubmitting = false;
      state.guessMode = false;
      // A wrong guess rules the card out for good — permanent and not re-selectable,
      // unlike a manual exclusion mark which the player can freely undo.
      if (!action.payload.correct && !state.ruledOutCardIds.includes(action.payload.cardId)) {
        state.ruledOutCardIds.push(action.payload.cardId);
      }
    },
    finalGuessError(state, action: PayloadAction<{ message: string }>) {
      state.isSubmitting = false;
      state.actionError = action.payload.message;
    },
    rematchBegin(state) {
      state.isSubmitting = true;
      state.actionError = null;
    },
    rematchSuccess(state) {
      state.isSubmitting = false;
    },
    rematchError(state, action: PayloadAction<{ message: string }>) {
      state.isSubmitting = false;
      state.actionError = action.payload.message;
    },
  },
});

export const roomActions = slice.actions;
export const roomReducer = slice.reducer;
