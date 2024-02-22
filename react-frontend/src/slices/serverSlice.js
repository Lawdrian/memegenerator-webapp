import { createSlice } from '@reduxjs/toolkit';

const serverSlice = createSlice({
  name: 'server',
  initialState: {
    serverReachable: true, // assume server is reachable until proven otherwise
    cachedMemes: [], // store memes in redux store if server is not reachable
  },
  reducers: {
    setServerReachable: (state) => {
      state.serverReachable = true;
    },
    setServerNotReachable: (state) => {
      state.serverReachable = false;
    },
    cacheMeme: (state, action) => {
      state.cachedMemes = [...state.cachedMemes, action.payload];
    },
    resetMemeCache: (state) => {
      state.cachedMemes = [];
    }
  },
});

export const { setServerReachable, setServerNotReachable, cacheMeme, resetMemeCache } = serverSlice.actions;
export default serverSlice.reducer;