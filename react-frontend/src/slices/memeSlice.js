import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Asynchronous thunk for fetching all memes
export const fetchAllMemes = createAsyncThunk(
  'meme/fetchAll',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/meme", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch memes');
      const data = await response.json();
      return data.memes; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
        // make copy of the meme and add the new comment
        const updatedMeme = {
          ...state.memes[index],
          comments: [...state.memes[index].comments, comment],
        };

        state.memes = [
          ...state.memes.slice(0, index),
          updatedMeme,
          ...state.memes.slice(index + 1),
        ];
      }
    },
    setSorting: (state, action) => {
        state.sorting = action.payload;
    },
    setFiltering: (state, action) => {
        state.filtering = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMemes.fulfilled, (state, action) => {
        state.memes = action.payload;
        state.memesLoaded = true;
      })
      .addCase(fetchAllMemes.rejected, (state, action) => {
        // Handle the rejected case
        console.error("Failed to load memes:", action.payload);
      });
  },
});

export const { setMemes, appendMemes, updateLikesDislikes, addComment, setSorting, setFiltering } =
  memeSlice.actions;
export default memeSlice.reducer;
