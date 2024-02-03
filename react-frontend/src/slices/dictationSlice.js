import { createSlice } from "@reduxjs/toolkit";

const dictationSlice = createSlice({
    name: 'dictation',
    initialState: {
        command: "Default", 
        textfeld: "Default",
        title: "Default",
    },
    reducers: {
        setDictation: (state, action) => {
            const {spokenText} = action.payload || {};
            state.command = spokenText; 
        },

    },
});

export const { setDictation } = dictationSlice.actions;
export default dictationSlice.reducer;