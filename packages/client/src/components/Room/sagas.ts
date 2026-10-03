import { eventChannel, type EventChannel } from 'redux-saga';
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import type { RoomSnapshot } from '@guess-table/shared';
import * as socketClient from '../../shared/socket/socketClient';
import * as storageHelpers from '../../shared/helpers/storageHelpers';
import { sessionActions, selectPlayerName, selectSessionRoomId } from '../../shared/session';
import { AsyncStatus } from '../../shared/types';
import { roomActions } from './slice';
import { selectExcludedCardIds, selectJoinStatus, selectRuledOutCardIds } from './selectors/baseSelectors';

function createRoomStateChannel(): EventChannel<RoomSnapshot> {
  return eventChannel((emit) => {
    const socket = socketClient.getSocket();
    const handleRoomState = (snapshot: RoomSnapshot) => emit(snapshot);
    socket.on('room:state', handleRoomState);
    return () => socket.off('room:state', handleRoomState);
  });
}

function createSocketConnectChannel(): EventChannel<true> {
  return eventChannel((emit) => {
    const socket = socketClient.getSocket();
    const handleConnect = () => emit(true);
    socket.on('connect', handleConnect);
    return () => socket.off('connect', handleConnect);
  });
}

function* watchRoomStateChannel() {
  const channel: EventChannel<RoomSnapshot> = yield call(createRoomStateChannel);
  while (true) {
    const snapshot: RoomSnapshot = yield take(channel);
    yield put(roomActions.roomSnapshotReceived({ snapshot }));
  }
}

/**
 * The very first `connect` already happens before anyone has joined a room (socket
 * auto-connects at app boot), so `joinStatus` is still Idle then and this watcher no-ops.
 * Only a later reconnect — after a successful join — re-sends joinRoomBegin.
 */
function* watchSocketReconnect() {
  const channel: EventChannel<true> = yield call(createSocketConnectChannel);
  while (true) {
    yield take(channel);
    const joinStatus: AsyncStatus = yield select(selectJoinStatus);
    const roomId: string | null = yield select(selectSessionRoomId);
    const playerName: string = yield select(selectPlayerName);
    if (joinStatus === AsyncStatus.Succeeded && roomId && playerName) {
      yield put(roomActions.joinRoomBegin({ roomId, playerName }));
    }
  }
}

function* handleJoinRoom(action: ReturnType<typeof roomActions.joinRoomBegin>) {
  const { roomId, playerName } = action.payload;
  const stored = storageHelpers.loadSession(roomId);
  const ack: Awaited<ReturnType<typeof socketClient.joinRoom>> = yield call(
    socketClient.joinRoom,
    roomId,
    playerName,
    stored?.playerToken
  );
  if (!ack.ok) {
    yield put(roomActions.joinRoomError({ message: ack.error.message }));
    return;
  }
  const { playerId, playerToken, snapshot } = ack.data;
  storageHelpers.saveSession(roomId, { playerId, playerToken, playerName });
  storageHelpers.savePlayerName(playerName);
  yield put(sessionActions.sessionEstablished({ playerId, playerToken, roomId, playerName }));
  yield put(roomActions.roomSnapshotReceived({ snapshot }));
  const excludedCardIds = storageHelpers.loadExcludedCardIds(roomId);
  yield put(roomActions.excludedCardIdsLoaded({ cardIds: excludedCardIds }));
  const ruledOutCardIds = storageHelpers.loadRuledOutCardIds(roomId);
  yield put(roomActions.ruledOutCardIdsLoaded({ cardIds: ruledOutCardIds }));
}

function* handleSelectSecret(action: ReturnType<typeof roomActions.selectSecretBegin>) {
  const ack: Awaited<ReturnType<typeof socketClient.selectSecret>> = yield call(
    socketClient.selectSecret,
    action.payload.cardId
  );
  if (ack.ok) {
    yield put(roomActions.selectSecretSuccess());
  } else {
    yield put(roomActions.selectSecretError({ message: ack.error.message }));
  }
}

function* handleAskQuestion(action: ReturnType<typeof roomActions.askQuestionBegin>) {
  const ack: Awaited<ReturnType<typeof socketClient.askQuestion>> = yield call(
    socketClient.askQuestion,
    action.payload.text
  );
  if (ack.ok) {
    yield put(roomActions.askQuestionSuccess());
  } else {
    yield put(roomActions.askQuestionError({ message: ack.error.message }));
  }
}

function* handleAnswerQuestion(action: ReturnType<typeof roomActions.answerQuestionBegin>) {
  const { questionId, answer } = action.payload;
  const ack: Awaited<ReturnType<typeof socketClient.answerQuestion>> = yield call(
    socketClient.answerQuestion,
    questionId,
    answer
  );
  if (ack.ok) {
    yield put(roomActions.answerQuestionSuccess());
  } else {
    yield put(roomActions.answerQuestionError({ message: ack.error.message }));
  }
}

function* handleFinalGuess(action: ReturnType<typeof roomActions.finalGuessBegin>) {
  const { cardId } = action.payload;
  const ack: Awaited<ReturnType<typeof socketClient.finalGuess>> = yield call(socketClient.finalGuess, cardId);
  if (ack.ok) {
    yield put(roomActions.finalGuessSuccess({ cardId, correct: ack.data.correct }));
  } else {
    yield put(roomActions.finalGuessError({ message: ack.error.message }));
  }
}

function* handleRematchBegin() {
  const ack: Awaited<ReturnType<typeof socketClient.rematchBegin>> = yield call(socketClient.rematchBegin);
  if (ack.ok) {
    yield put(roomActions.rematchSuccess());
  } else {
    yield put(roomActions.rematchError({ message: ack.error.message }));
  }
}

/**
 * Persists the current exclusion marks whenever they might have changed: on an explicit
 * toggle, and after every snapshot (covers the rematch reset clearing them back to []).
 */
function* persistExcludedCardIds() {
  const roomId: string | null = yield select(selectSessionRoomId);
  if (!roomId) return;
  const excludedCardIds: string[] = yield select(selectExcludedCardIds);
  storageHelpers.saveExcludedCardIds(roomId, excludedCardIds);
}

/** Same as above, but for permanently ruled-out (failed-guess) cards. */
function* persistRuledOutCardIds() {
  const roomId: string | null = yield select(selectSessionRoomId);
  if (!roomId) return;
  const ruledOutCardIds: string[] = yield select(selectRuledOutCardIds);
  storageHelpers.saveRuledOutCardIds(roomId, ruledOutCardIds);
}

export function* roomSaga() {
  yield all([
    watchRoomStateChannel(),
    watchSocketReconnect(),
    takeLatest(roomActions.joinRoomBegin, handleJoinRoom),
    takeLatest(roomActions.selectSecretBegin, handleSelectSecret),
    takeLatest(roomActions.askQuestionBegin, handleAskQuestion),
    takeLatest(roomActions.answerQuestionBegin, handleAnswerQuestion),
    takeLatest(roomActions.finalGuessBegin, handleFinalGuess),
    takeLatest(roomActions.rematchBegin, handleRematchBegin),
    takeEvery(roomActions.cardExclusionToggled, persistExcludedCardIds),
    takeEvery(roomActions.finalGuessSuccess, persistExcludedCardIds),
    takeEvery(roomActions.roomSnapshotReceived, persistExcludedCardIds),
    takeEvery(roomActions.finalGuessSuccess, persistRuledOutCardIds),
    takeEvery(roomActions.roomSnapshotReceived, persistRuledOutCardIds),
  ]);
}
