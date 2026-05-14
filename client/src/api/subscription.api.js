// Subscription API calls (authenticated)
import axios from "./axios.js";

export const createSubscriptionCheckoutApi = (planId) =>
  axios.post("/subscriptions/checkout", { planId });

export const getMySubscriptionApi = () => axios.get("/subscriptions/me");

export const cancelSubscriptionApi = () => axios.post("/subscriptions/cancel");

export const changeSubscriptionApi = (planId) =>
  axios.post("/subscriptions/change", { planId });
