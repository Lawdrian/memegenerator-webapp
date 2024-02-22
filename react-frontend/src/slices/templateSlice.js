import { createSlice } from '@reduxjs/toolkit';

const templateSlice = createSlice({
    name: 'template',
    initialState: {
        templatesLoaded: false,
        templates: [{
            _id: null,
            name: null,
            description: null,
            format: null,
            content: null,
        }],
    },
    reducers: {
        setTemplates: (state, action) => {  
            if(action.payload !== null && action.payload != []) {
                console.log("templates successfully loaded")
                state.templates = action.payload;
                if(action.payload.length > 0) {
                    state.templatesLoaded = true;
                }
            } else {
                console.error("setTemplates: templates data is empty");
            }
            
        },
        setTemplatesLoaded: (state, action) => {
            if(action.payload === true || action.payload === false) {
                state.templatesLoaded = action.payload;
            } else {
                console.error("setTemplatesLoaded: templatesLoaded must be true or false");
            }
        },
    },
});

export const { setTemplates, setTemplatesLoaded } = templateSlice.actions;
export default templateSlice.reducer;