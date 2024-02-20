import { createSlice } from "@reduxjs/toolkit";

const dictationSlice = createSlice({
    name: 'dictation',
    initialState: {
        command: "Default", 
        textfeld: "Default",
        title: "Default",
        imageReader: false,
    },
    reducers: {
        setDictation: (state, action) => {
            const {spokenText} = action.payload || {};
            state.command = spokenText; 
        },
        setImageReader: (state, action) => {
            state.imageReader = action.payload || false;
            
        }

    },
});

export const { setDictation, setImageReader } = dictationSlice.actions;
export default dictationSlice.reducer;