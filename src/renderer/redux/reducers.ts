import { combineReducers } from '@reduxjs/toolkit';
import proxySlice from './slices/proxySlice';

const rootReducer = combineReducers({
  proxy: proxySlice,
});

export default rootReducer;
