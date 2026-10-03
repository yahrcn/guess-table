import { AsyncStatus } from '../../shared/types';

export interface HomeState {
  createStatus: AsyncStatus;
  createError: string | null;
  createdRoomId: string | null;
}
