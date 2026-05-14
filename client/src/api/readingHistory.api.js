// Reading history API calls
import axios from "./axios.js";

export const recordReadingApi = (articleId) =>
  axios.post(`/history/record/${articleId}`);

export const getMyHistoryApi = () => axios.get("/history/me");

export const clearHistoryApi = () => axios.delete("/history/clear");
