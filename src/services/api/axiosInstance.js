
import axios from "axios";
import { getAccessToken } from "../storage/tokenStorage";

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

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    error.status = error.response?.status ?? error.status ?? null;

    const responseData = error.response?.data;

    const message =
      responseData?.message ||
      responseData?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    error.message =
      typeof message === "string"
        ? message
        : "Something went wrong. Please try again.";

    return Promise.reject(error);
  }
);

export default axiosInstance;
