// Bookmark API calls
import axios from "./axios.js";

export const toggleBookmarkApi = (articleId) =>
  axios.post(`/bookmarks/toggle/${articleId}`);

export const getMyBookmarksApi = () => axios.get("/bookmarks/me");

export const checkBookmarkApi = (articleId) =>
  axios.get(`/bookmarks/check/${articleId}`);

export const removeBookmarkApi = (id) => axios.delete(`/bookmarks/${id}`);
