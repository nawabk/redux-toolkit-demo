import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostState {
  list: Post[];
  loading: boolean;
  error: string;
}

const initialState: PostState = {
  list: [],
  loading: false,
  error: "",
};

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = (await res.json()) as Post[];
      if (!Array.isArray(data)) return rejectWithValue("Something went wrong");
      return data;
    } catch (e) {
      return rejectWithValue("Something went wrong");
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state, action) => {
      console.log(action);
      state.loading = true;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.list = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      console.log(action);
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default postSlice.reducer;
