// Analytics / report API calls
import axios from "./axios.js";

export const getMostReadArticlesApi = (limit = 10) =>
  axios.get("/reports/most-read", { params: { limit } });

export const getTopSubscribersApi = (limit = 10) =>
  axios.get("/reports/top-subscribers", { params: { limit } });

export const getRevenueReportApi = (params = {}) =>
  axios.get("/reports/revenue", { params });

// Exports a downloadable PDF — returns a blob
export const exportRevenuePDFApi = (params = {}) =>
  axios.get("/reports/revenue/export", { params, responseType: "blob" });
