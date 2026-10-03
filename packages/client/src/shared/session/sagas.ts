import { eventChannel, type EventChannel } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';
import { getSocket } from '../socket/socketClient';
import { sessionActions } from './slice';
import { ConnectionStatus } from './types';

function createConnectionStatusChannel(): EventChannel<ConnectionStatus> {
  return eventChannel((emit) => {
    const socket = getSocket();
    const handleConnect = () => emit(ConnectionStatus.Connected);
    const handleDisconnect = () => emit(ConnectionStatus.Disconnected);
    const handleError = () => emit(ConnectionStatus.Error);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
    };
  });
}

export function* sessionSaga() {
  const channel: EventChannel<ConnectionStatus> = yield call(createConnectionStatusChannel);
  while (true) {
    const status: ConnectionStatus = yield take(channel);
    yield put(sessionActions.connectionStatusChanged({ status }));
  }
}
