import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null, // Achte auf die richtige Namensgebung
        token: null,  //Hier wird Token gespeichrt
    },
    reducers: {
        setUser: (state, action) => {
            const { user, token } = action.payload || {}; // Standardwerte für den Fall, dass action.payload null ist

            state.currentUser = user;
            state.token = token;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
    },
});

export const { setUser, setProfile } = userSlice.actions;
export default userSlice.reducer;