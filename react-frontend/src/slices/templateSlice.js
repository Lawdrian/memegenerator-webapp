import { createSlice } from '@reduxjs/toolkit';

const templateSlice = createSlice({
    name: 'template',
    initialState: {
        templates: [{
            id: null,
            name: null,
            type: null,
            content: null,
        }],
    },
    reducers: {
        setTemplates: (state, action) => {
            const { templates } = action.payload || {}; 

            state.templates = templates;
        },
    },
});

export const { setTemplates } = templateSlice.actions;
export default templateSlice.reducer;