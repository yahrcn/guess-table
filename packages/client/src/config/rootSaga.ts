import { all } from 'redux-saga/effects';
import { homeSaga } from '../components/Home';
import { roomSaga } from '../components/Room';
import { sessionSaga } from '../shared/session';

export function* rootSaga() {
  yield all([sessionSaga(), homeSaga(), roomSaga()]);
}
