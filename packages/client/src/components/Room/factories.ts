import { AsyncStatus } from '../../shared/types';
import type { RoomState } from './types';

export function createRoomState(model?: Partial<RoomState>): RoomState {
  return {
    snapshot: null,
    joinStatus: AsyncStatus.Idle,
    joinError: null,
    isSubmitting: false,
    actionError: null,
    guessMode: false,
    excludedCardIds: [],
    ruledOutCardIds: [],
    ...model,
  };
}
