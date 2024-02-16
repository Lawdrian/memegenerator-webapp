import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    command: "Default", 
    textfeld: "Default",
    title: "Default",
    caption: {index: 0, value: ""},
    selectCaption: null,
    name: "",
    description: "",
    imageReader: false,
}

const dictationSlice = createSlice({
    name: 'dictation',
    initialState: {
       ...initialState
    },
    reducers: {
        setDictation: (state, action) => {
            const {spokenText} = action.payload || {};
            state.command = spokenText; 
        },
        setImageReader: (state, action) => {
            state.imageReader = action.payload || false;
        },
        setCaption: (state, action) => {
            const {index, spokenText} = action.payload || {};
            console.log("setCaption: ", index, spokenText);
            state.caption = {index: index, value: spokenText};
        },
        setName: (state, action) => {
            console.log("setName: ", action.payload);
            const {spokenText} = action.payload || {};
            state.name = spokenText; 
        },
        setDescription: (state, action) => {
            console.log("setDescription: ", action.payload);
            const {spokenText} = action.payload || {};
            state.description = spokenText; 
        },
        selectCaption: (state, action) => {
            const {index} = action.payload || {};
            state.selectCaption = index;
        },
        resetDictation: (state) => {
            return {...initialState};
        }

    },
});

export const { setDictation,setImageReader, setName, setCaption, setDescription, selectCaption, resetDictation } = dictationSlice.actions;
export default dictationSlice.reducer;