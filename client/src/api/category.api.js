// Category API calls
import axios from "./axios.js";

// Public
export const getAllCategoriesApi = () => axios.get("/categories");
export const getCategoryByIdApi = (id) => axios.get(`/categories/${id}`);

// Admin
export const createCategoryApi = (formData) =>
  axios.post("/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCategoryApi = (id, formData) =>
  axios.put(`/categories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCategoryApi = (id) => axios.delete(`/categories/${id}`);
