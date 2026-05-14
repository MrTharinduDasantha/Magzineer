// Settings API calls
import axios from "./axios.js";

export const getSettingsApi = () => axios.get("/settings");

export const updateSettingsApi = (formData) =>
  axios.put("/settings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
