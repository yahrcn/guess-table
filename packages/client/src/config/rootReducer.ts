import { combineReducers } from '@reduxjs/toolkit';
import { homeReducer } from '../components/Home';
import { roomReducer } from '../components/Room';
import { sessionReducer } from '../shared/session';

export const rootReducer = combineReducers({
  session: sessionReducer,
  home: homeReducer,
  room: roomReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
