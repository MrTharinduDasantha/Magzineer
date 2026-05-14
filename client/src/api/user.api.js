// User profile API calls
import axios from "./axios.js";

export const getProfileApi = () => axios.get("/users/profile");

export const updateProfileApi = (formData) =>
  axios.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changePasswordApi = (data) =>
  axios.put("/users/change-password", data);
