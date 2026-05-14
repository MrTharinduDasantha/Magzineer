// Search slice — query string, filters, results, pagination
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { globalSearchApi } from "../../api/search.api.js";

export const performSearch = createAsyncThunk(
  "search/perform",
  async (params) => {
    const { data } = await globalSearchApi(params);
    return data.data;
  },
);

const initialFilters = {
  magazine: "",
  issue: "",
  category: "",
  from: "",
  to: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    filters: { ...initialFilters },
    magazines: [],
    articles: [],
    pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { ...initialFilters };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearResults: (state) => {
      state.magazines = [];
      state.articles = [];
      state.pagination = { page: 1, limit: 12, total: 0, totalPages: 0 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.magazines = action.payload.magazines || [];
        state.articles = action.payload.articles || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setQuery, setFilters, resetFilters, setPage, clearResults } =
  searchSlice.actions;
export default searchSlice.reducer;
