// Article API calls — public + admin
import axios from "./axios.js";

// Public
export const getArticlesApi = (params = {}) =>
  axios.get("/articles", { params });
export const getTrendingArticlesApi = (limit = 6) =>
  axios.get("/articles/trending", { params: { limit } });
export const getArticleByIdApi = (id) => axios.get(`/articles/${id}`);
export const getRelatedArticlesApi = (id, limit = 4) =>
  axios.get(`/articles/${id}/related`, { params: { limit } });

// Admin
export const adminGetAllArticlesApi = (params = {}) =>
  axios.get("/articles/admin/all", { params });
export const adminGetArticleByIdApi = (id) =>
  axios.get(`/articles/admin/${id}`);

export const createArticleApi = (formData) =>
  axios.post("/articles", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateArticleApi = (id, formData) =>
  axios.put(`/articles/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteArticleApi = (id) => axios.delete(`/articles/${id}`);
