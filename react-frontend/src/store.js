/*
* Creates a Redux store that holds the complete state tree of our app.
* Automatically serializes the state and persists it to local storage.
*/
import { configureStore } from '@reduxjs/toolkit';
import dictationReducer from './slices/dictationSlice';
import userReducer from './slices/userSlice'; 
import templateReducer from './slices/templateSlice';

const persistedUserState = JSON.parse(localStorage.getItem('user')) || null; 

const store = configureStore({
  reducer: {
    dictation: dictationReducer,
    user: userReducer,
    template: templateReducer,
  },
  preloadedState: {
    user: persistedUserState,
  },
});

store.subscribe(() => {
  localStorage.setItem('user', JSON.stringify(store.getState().user));
});
export default store;
