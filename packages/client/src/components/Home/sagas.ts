import { call, put, takeLatest } from 'redux-saga/effects';
import * as socketClient from '../../shared/socket/socketClient';
import * as storageHelpers from '../../shared/helpers/storageHelpers';
import { sessionActions } from '../../shared/session';
import { homeActions } from './slice';

/**
 * Only persists identity + triggers navigation. The actual room snapshot is fetched once
 * Room mounts for the new roomId and runs its own joinRoomBegin (it finds the session we
 * just saved here and reconnects via the token) — keeps Home and Room independent of
 * each other's action types.
 */
function* handleCreateRoom(action: ReturnType<typeof homeActions.createRoomBegin>) {
  const { playerName } = action.payload;
  const ack: Awaited<ReturnType<typeof socketClient.createRoom>> = yield call(socketClient.createRoom, playerName);
  if (!ack.ok) {
    yield put(homeActions.createRoomError({ message: ack.error.message }));
    return;
  }
  const { roomId, playerId, playerToken } = ack.data;
  storageHelpers.saveSession(roomId, { playerId, playerToken, playerName });
  storageHelpers.savePlayerName(playerName);
  yield put(sessionActions.sessionEstablished({ playerId, playerToken, roomId, playerName }));
  yield put(homeActions.createRoomSuccess({ roomId }));
}

export function* homeSaga() {
  yield takeLatest(homeActions.createRoomBegin, handleCreateRoom);
}
