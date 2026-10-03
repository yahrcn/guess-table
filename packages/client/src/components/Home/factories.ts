import { AsyncStatus } from '../../shared/types';
import type { HomeState } from './types';

export function createHomeState(model?: Partial<HomeState>): HomeState {
  return {
    createStatus: AsyncStatus.Idle,
    createError: null,
    createdRoomId: null,
    ...model,
  };
}
