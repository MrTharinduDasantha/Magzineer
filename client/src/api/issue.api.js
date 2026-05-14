// Issue API calls — public + admin
import axios from "./axios.js";

// Public
export const getLatestIssuesApi = (limit = 12) =>
  axios.get("/issues/latest", { params: { limit } });

export const getIssuesByMagazineApi = (magazineId) =>
  axios.get(`/issues/magazine/${magazineId}`);

export const getIssueByIdApi = (id) => axios.get(`/issues/${id}`);

// Admin
export const adminGetAllIssuesApi = (params = {}) =>
  axios.get("/issues/admin/all", { params });

export const createIssueApi = (formData) =>
  axios.post("/issues", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateIssueApi = (id, formData) =>
  axios.put(`/issues/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteIssueApi = (id) => axios.delete(`/issues/${id}`);

export const bulkUpdateIssueStatusApi = (data) =>
  axios.patch("/issues/bulk-status", data);

export const assignArticlesToIssueApi = (id, articleIds) =>
  axios.patch(`/issues/${id}/assign-articles`, { articleIds });

export const unassignArticleFromIssueApi = (issueId, articleId) =>
  axios.patch(`/issues/${issueId}/unassign-article/${articleId}`);
