import { createSlice } from '@reduxjs/toolkit';

const templateSlice = createSlice({
    name: 'template',
    initialState: {
        templatesLoaded: false,
        templates: [{
            id: null,
            name: null,
            format: null,
            content: null,
        }],
    },
    reducers: {
        setTemplates: (state, action) => {
            const { templates } = action.payload || {}; 
            if(templates !== null) {
                console.log("templates successfully loaded")
                state.templates = templates;
                state.templatesLoaded = true;
            } else {
                console.error("setTemplates: templates data is empty");
            }
            
        },
        setTemplatesLoaded: (state, action) => {
            const { templatesLoaded } = action.payload || {}; 
            if(templatesLoaded === true || templatesLoaded === false) {
                state.templatesLoaded = templatesLoaded;
            } else {
                console.error("setTemplatesLoaded: templatesLoaded must be true or false");
            }
        },
    },
});

export const { setTemplates, setTemplatesLoaded } = templateSlice.actions;
export default templateSlice.reducer;