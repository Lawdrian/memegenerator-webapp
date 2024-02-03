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
        updateLikesDislikes: (state, action) => {
            const { memeId, upVotes, downVotes } = action.payload;
            const meme = state.memes.find(meme => meme._id === memeId);
            if (meme) {
                meme.upVotes = upVotes;
                meme.downVotes = downVotes;
            }
        },
        addComment: (state, action) => {
            const { memeId, comment } = action.payload;
            const meme = state.memes.find(meme => meme._id === memeId);
            if (meme) {
                meme.comments.push(comment);
            }
        },
    },
});

export const { setMemes, updateLikesDislikes, addComment } = memeSlice.actions;
export default memeSlice.reducer;

