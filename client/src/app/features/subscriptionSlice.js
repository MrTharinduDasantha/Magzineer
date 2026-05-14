// Subscription slice — current user's active subscription + the public plans catalog
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMySubscriptionApi } from "../../api/subscription.api.js";
import { getActivePlansApi } from "../../api/subscriptionPlan.api.js";

export const fetchMySubscription = createAsyncThunk(
  "subscription/fetchMine",
  async () => {
    const { data } = await getMySubscriptionApi();
    return data.data.subscription;
  },
);

export const fetchActivePlans = createAsyncThunk(
  "subscription/fetchPlans",
  async () => {
    const { data } = await getActivePlansApi();
    return data.data.plans;
  },
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    current: null,
    plans: [],
    plansLoading: false,
    loading: false,
  },
  reducers: {
    clearSubscription: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMySubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchMySubscription.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchActivePlans.pending, (state) => {
        state.plansLoading = true;
      })
      .addCase(fetchActivePlans.fulfilled, (state, action) => {
        state.plansLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchActivePlans.rejected, (state) => {
        state.plansLoading = false;
      });
  },
});

export const { clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
