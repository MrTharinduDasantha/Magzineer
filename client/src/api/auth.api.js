// Authentication API calls
import axios from "./axios.js";

export const registerApi = (formData) =>
  axios.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const loginApi = (credentials) => axios.post("/auth/login", credentials);

export const adminLoginApi = (credentials) =>
  axios.post("/auth/admin-login", credentials);

export const logoutApi = () => axios.post("/auth/logout");

export const getMeApi = () => axios.get("/auth/me");
