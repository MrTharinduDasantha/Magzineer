// Contact form API calls
import axios from "./axios.js";

export const submitContactApi = (data) => axios.post("/contact", data);

// Admin
export const adminGetAllMessagesApi = (params = {}) =>
  axios.get("/contact/admin/all", { params });

export const adminUpdateMessageStatusApi = (id, status) =>
  axios.patch(`/contact/admin/${id}/status`, { status });

export const adminDeleteMessageApi = (id) =>
  axios.delete(`/contact/admin/${id}`);
