import { configureStore } from '@reduxjs/toolkit';
import dictationReducer from './slices/dictationSlice';
import userReducer from './slices/userSlice'; 
import templateReducer from './slices/templateSlice';
import serverSlice from './slices/serverSlice';
import draftSlice from './slices/draftSlice';
import memeReducer from './slices/memeSlice';

const persistedUserState = JSON.parse(localStorage.getItem('user')) || {};


const store = configureStore({
  reducer: {
    dictation: dictationReducer,
    user: userReducer,
    template: templateReducer,
    meme: memeReducer,
    server: serverSlice,
    draft: draftSlice,
  },
  preloadedState: {
    user: persistedUserState, 
  },});

store.subscribe(() => {
  localStorage.setItem('user', JSON.stringify(store.getState().user));
});

export default store;
