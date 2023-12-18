/*
* Creates a Redux store that holds the complete state tree of our app.
* Automatically serializes the state and persists it to local storage.
*/
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'; // Passe den Pfad entsprechend deiner Struktur an

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
