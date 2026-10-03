import { createSelector } from 'reselect';
import { selectPlayerName } from '../../../shared/session';
import { selectCreateError, selectCreatedRoomId, selectCreateStatus } from './baseSelectors';

/** The single view model Home.tsx renders from — one `useAppSelector` call. */
export const selectHomeViewModel = createSelector(
  [selectPlayerName, selectCreateStatus, selectCreateError, selectCreatedRoomId],
  (playerName, createStatus, createError, createdRoomId) => ({
    playerName,
    createStatus,
    createError,
    createdRoomId,
  })
);

export type HomeViewModel = ReturnType<typeof selectHomeViewModel>;
