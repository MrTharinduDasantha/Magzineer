// Payment API calls
import axios from "./axios.js";

export const getMyPaymentsApi = () => axios.get("/payments/me");

export const adminGetAllPaymentsApi = (params = {}) =>
  axios.get("/payments/admin/all", { params });
