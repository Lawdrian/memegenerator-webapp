/*
* Creates a Redux store that holds the complete state tree of our app.
* Automatically serializes the state and persists it to local storage.
*/
import { configureStore } from '@reduxjs/toolkit';
import dictationReducer from './slices/dictationSlice';
import userReducer from './slices/userSlice'; // Passe den Pfad entsprechend deiner Struktur an
import templateReducer from './slices/templateSlice';
import memeReducer from './slices/memeSlice';

const store = configureStore({
  reducer: {
    dictation: dictationReducer,
    user: userReducer,
    template: templateReducer,
    meme: memeReducer,
  },
});

export default store;
