import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ProxyState {
  pathProxyFile: string;
}

const initialState: ProxyState = {
  pathProxyFile: '',
};

export const proxySlice = createSlice({
  name: 'proxy',
  initialState,
  reducers: {
    setPathProxyFile: (state, action: PayloadAction<string>) => {
      state.pathProxyFile = action.payload;
    },
  },
});

export const { setPathProxyFile } = proxySlice.actions;

export default proxySlice.reducer;
