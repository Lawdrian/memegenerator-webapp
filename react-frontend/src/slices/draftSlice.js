import { createSlice } from '@reduxjs/toolkit';

const draftSlice = createSlice({
    name: 'draft',
    initialState: {
        draftsLoaded: false,
        drafts: [{
          _id: null, 
          name: null,
          createdBy: null,
          format: null,
          textProperties: [],
          usedTemplate: null,
          createdAt: null, 
          updatedAt: null
        }],
    },
    reducers: {
        setDrafts: (state, action) => { 
            if(action.payload !== null && action.payload != []) {
                console.log("drafts successfully loaded")
                state.drafts = action.payload;
                state.draftsLoaded = true;
            } else {
                console.error("setDrafts: drafts data is empty");
            }
            
        },
        setDraftsLoaded: (state, action) => {
            if(action.payload === true || action.payload === false) {
                state.draftsLoaded = action.payload;
            } else {
                console.error("setDraftsLoaded: draftsLoaded must be true or false");
            }
        },
    },
});

export const { setDrafts, setDraftsLoaded } = draftSlice.actions;
export default draftSlice.reducer;