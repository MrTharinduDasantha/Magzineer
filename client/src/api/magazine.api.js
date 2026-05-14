// Magazine API calls — public + admin
import axios from "./axios.js";

// Public
export const getAllMagazinesApi = (params = {}) =>
  axios.get("/magazines", { params });

export const getFeaturedMagazinesApi = () => axios.get("/magazines/featured");

export const getMagazineByIdApi = (id) => axios.get(`/magazines/${id}`);

// Admin
export const adminGetAllMagazinesApi = (params = {}) =>
  axios.get("/magazines/admin/all", { params });

export const createMagazineApi = (formData) =>
  axios.post("/magazines", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateMagazineApi = (id, formData) =>
  axios.put(`/magazines/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteMagazineApi = (id) => axios.delete(`/magazines/${id}`);

export const toggleMagazineStatusApi = (id) =>
  axios.patch(`/magazines/${id}/toggle-status`);
