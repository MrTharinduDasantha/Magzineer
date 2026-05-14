// Base Axios instance — sends cookies, base URL from env, global error toast
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the HTTP-only auth cookie on every request
  timeout: 30000,
});

// ─── Request interceptor ───
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// ─── Response interceptor — surface friendly toasts ───
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong.";

    // Auto-redirect on auth expiry (but skip on the /auth/me probe call)
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/me")
    ) {
      // Let the calling code decide whether to redirect; just toast here
      toast.error(message);
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
