import { createSelector } from 'reselect';
import { selectPlayerId } from '../../../shared/session';
import {
  selectActionError,
  selectExcludedCardIds,
  selectGuessMode,
  selectIsSubmitting,
  selectJoinError,
  selectJoinStatus,
  selectRoomSnapshot,
  selectRuledOutCardIds,
} from './baseSelectors';

/**
 * The single view model Room.tsx renders from — one `useAppSelector` call instead of
 * reaching for a dozen individual selectors (and the view-only derived fields like
 * `isMyTurn`/`pendingQuestion` live here rather than duplicated as room state, per
 * selectRoomSnapshot's own "don't store what you can derive" rule).
 */
export const selectRoomViewModel = createSelector(
  [
    selectRoomSnapshot,
    selectJoinStatus,
    selectJoinError,
    selectIsSubmitting,
    selectActionError,
    selectGuessMode,
    selectExcludedCardIds,
    selectRuledOutCardIds,
    selectPlayerId,
  ],
  (snapshot, joinStatus, joinError, isSubmitting, actionError, guessMode, excludedCardIds, ruledOutCardIds, myPlayerId) => {
    const pendingQuestion = snapshot?.pendingQuestionId
      ? (snapshot.questions.find((question) => question.id === snapshot.pendingQuestionId) ?? null)
      : null;

    return {
      snapshot,
      joinStatus,
      joinError,
      isSubmitting,
      actionError,
      guessMode,
      excludedCardIds,
      ruledOutCardIds,
      myPlayerId,
      pendingQuestion,
      isMyTurn: Boolean(snapshot && myPlayerId && snapshot.currentTurnPlayerId === myPlayerId),
      isPendingQuestionMine: Boolean(pendingQuestion && myPlayerId && pendingQuestion.authorId === myPlayerId),
      haveSelectedSecret: Boolean(snapshot?.mySecretCardId),
    };
  }
);

export type RoomViewModel = ReturnType<typeof selectRoomViewModel>;
