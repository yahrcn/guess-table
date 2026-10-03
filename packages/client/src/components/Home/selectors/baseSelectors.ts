import type { HomeState } from '../types';

export interface WithHome {
  home: HomeState;
}

export const getHomeRoot = (state: WithHome): HomeState => state.home;

export const selectCreateStatus = (state: WithHome) => getHomeRoot(state).createStatus;
export const selectCreateError = (state: WithHome) => getHomeRoot(state).createError;
export const selectCreatedRoomId = (state: WithHome) => getHomeRoot(state).createdRoomId;
