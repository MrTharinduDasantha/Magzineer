// Global search API
import axios from "./axios.js";

export const globalSearchApi = (params = {}) =>
  axios.get("/search", { params });
