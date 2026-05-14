// Article slice — trending list + currently-open article
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTrendingArticlesApi,
  getArticleByIdApi,
} from "../../api/article.api.js";

export const fetchTrendingArticles = createAsyncThunk(
  "articles/fetchTrending",
  async (limit = 6) => {
    const { data } = await getTrendingArticlesApi(limit);
    return data.data.articles;
  },
);

export const fetchArticleById = createAsyncThunk(
  "articles/fetchById",
  async (id) => {
    const { data } = await getArticleByIdApi(id);
    return data.data.article;
  },
);

const articleSlice = createSlice({
  name: "articles",
  initialState: {
    trending: [],
    trendingLoading: false,
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentArticle: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingArticles.pending, (state) => {
        state.trendingLoading = true;
      })
      .addCase(fetchTrendingArticles.fulfilled, (state, action) => {
        state.trendingLoading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrendingArticles.rejected, (state) => {
        state.trendingLoading = false;
      })
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.current = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentArticle } = articleSlice.actions;
export default articleSlice.reducer;
