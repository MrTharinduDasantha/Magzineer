// Bookmark slice — user's bookmarks + per-article bookmarked state for the heart button
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyBookmarksApi,
  toggleBookmarkApi,
  removeBookmarkApi,
} from "../../api/bookmark.api.js";

export const fetchMyBookmarks = createAsyncThunk(
  "bookmarks/fetchMy",
  async () => {
    const { data } = await getMyBookmarksApi();
    return data.data.bookmarks;
  },
);

export const toggleBookmark = createAsyncThunk(
  "bookmarks/toggle",
  async (articleId) => {
    const { data } = await toggleBookmarkApi(articleId);
    return { articleId, bookmarked: data.data.bookmarked };
  },
);

export const removeBookmark = createAsyncThunk(
  "bookmarks/remove",
  async (id) => {
    await removeBookmarkApi(id);
    return id;
  },
);

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState: {
    items: [],
    // Map of articleId → bool, so the BookmarkButton can read state instantly
    statusMap: {},
    loading: false,
  },
  reducers: {
    setBookmarkStatus: (state, action) => {
      const { articleId, bookmarked } = action.payload;
      state.statusMap[articleId] = bookmarked;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookmarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Build the statusMap from fetched bookmarks
        state.statusMap = action.payload.reduce((acc, b) => {
          if (b.article?._id) acc[b.article._id] = true;
          return acc;
        }, {});
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        const { articleId, bookmarked } = action.payload;
        state.statusMap[articleId] = bookmarked;
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        const id = action.payload;
        const removed = state.items.find((b) => b._id === id);
        state.items = state.items.filter((b) => b._id !== id);
        if (removed?.article?._id) delete state.statusMap[removed.article._id];
      });
  },
});

export const { setBookmarkStatus } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
