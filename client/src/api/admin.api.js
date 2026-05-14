// Admin API calls
import axios from "./axios.js";

export const getDashboardStatsApi = () => axios.get("/admin/dashboard");

export const getAllUsersApi = (params = {}) =>
  axios.get("/admin/users", { params });

export const getUserDetailApi = (id) => axios.get(`/admin/users/${id}`);

export const toggleBlockUserApi = (id) =>
  axios.patch(`/admin/users/${id}/toggle-block`);
