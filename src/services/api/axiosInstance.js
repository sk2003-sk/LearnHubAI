import axios from "axios";
import { getAccessToken } from "../storage/tokenStorage";

// Empty base URL means "same origin", which the Vite dev/preview server
// proxies to the mock API (see vite.config.js). This keeps the app working
// regardless of the port Vite picks or whether localhost/127.0.0.1 is used.
const baseURL = import.meta.env.VITE_API_BASE_URL || "";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    error.status = error.response?.status ?? error.status ?? null;
    error.message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(error);
  },
);

export default axiosInstance;
