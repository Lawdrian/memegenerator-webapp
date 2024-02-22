import { createSlice } from "@reduxjs/toolkit";


const memeSlice = createSlice({
  name: "meme",
  initialState: {
    memesLoaded: false,
    memes: [
      {
        _id: null,
        name: "myMeme",
        createdBy: null,
        format: "",
        content: "",
        usedTemplate: null,
        privacy: "public",
        upVotes: [],
        downVotes: [],
        comments: [],
        createdAt: null,
        updatedAt: null,
      },
    ],
  },
  reducers: {
    setMemes: (state, action) => {
      const { memes } = action.payload || {};
      state.memes = memes;
      
    },
    updateLikesDislikes: (state, action) => {
      const { memeId, upVotes, downVotes } = action.payload;
      const index = state.memes.findIndex((meme) => meme._id === memeId);
      if (index !== -1) {
        // Create a new array with updates instead of mutating the existing state
        const updatedMemes = [...state.memes];
        updatedMemes[index] = {
          ...updatedMemes[index],
          upVotes: upVotes,
          downVotes: downVotes,
        };
        state.memes = updatedMemes; // Assign the updated memes array to the state
      }
    },
    addComment: (state, action) => {
      const { memeId, comment } = action.payload;
      const index = state.memes.findIndex((meme) => meme._id === memeId);
      if (index !== -1) {
        state.memes[index] = comment.comment
      }
    },
    setSorting: (state, action) => {
        state.sorting = action.payload;
    },
    setFiltering: (state, action) => {
        state.filtering = action.payload;
    },
  },
  
});

export const { setMemes, appendMemes, updateLikesDislikes, addComment, setSorting, setFiltering } =
  memeSlice.actions;
export default memeSlice.reducer;
