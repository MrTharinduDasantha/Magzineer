// Single-issue purchase API calls
import axios from "./axios.js";

export const createPurchaseCheckoutApi = (issueId) =>
  axios.post("/purchases/checkout", { issueId });

export const getMyPurchasesApi = () => axios.get("/purchases/me");
