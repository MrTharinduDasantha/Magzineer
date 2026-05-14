// Magazine slice — cached lists for the home/discovery pages
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllMagazinesApi,
  getFeaturedMagazinesApi,
} from "../../api/magazine.api.js";

export const fetchAllMagazines = createAsyncThunk(
  "magazines/fetchAll",
  async (params = {}) => {
    const { data } = await getAllMagazinesApi(params);
    return data.data.magazines;
  },
);

export const fetchFeaturedMagazines = createAsyncThunk(
  "magazines/fetchFeatured",
  async () => {
    const { data } = await getFeaturedMagazinesApi();
    return data.data.magazines;
  },
);

const magazineSlice = createSlice({
  name: "magazines",
  initialState: {
    all: [],
    featured: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMagazines.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllMagazines.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllMagazines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFeaturedMagazines.fulfilled, (state, action) => {
        state.featured = action.payload;
      });
  },
});

export default magazineSlice.reducer;
