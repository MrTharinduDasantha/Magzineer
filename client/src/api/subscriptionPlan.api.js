// Subscription plan API calls
import axios from "./axios.js";

// Public
export const getActivePlansApi = () => axios.get("/plans");
export const getDefaultPlanApi = () => axios.get("/plans/default");

// Admin
export const adminGetAllPlansApi = () => axios.get("/plans/admin/all");
export const createPlanApi = (data) => axios.post("/plans", data);
export const updatePlanApi = (id, data) => axios.put(`/plans/${id}`, data);
export const deletePlanApi = (id) => axios.delete(`/plans/${id}`);
export const togglePlanStatusApi = (id) =>
  axios.patch(`/plans/${id}/toggle-status`);
export const setDefaultPlanApi = (id) =>
  axios.patch(`/plans/${id}/set-default`);
