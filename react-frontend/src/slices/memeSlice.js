import { createSlice } from '@reduxjs/toolkit';

const memeSlice = createSlice({
    name: 'meme',
    initialState: {
        memes: [{
            _id: null,
            name: 'myMeme',
            createdBy: null,
            format: '',
            content: '',
            usedTemplate: null,
            private: false,
            upVotes: [],
            downVotes: [],
            comments: [],
            createdAt: null,
            updatedAt: null,
        }],
    },
    reducers: {
        setMemes: (state, action) => {
            const { memes } = action.payload || {}; 

            state.memes = memes;
        },
    },
});

export const { setMemes } = memeSlice.actions;
export default memeSlice.reducer;