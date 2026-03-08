import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Two types of axios Interceptors
// 1. Request Interceptors
// 2. Response Interceptors

// Request Interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach token automatically
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  // Handle error
  (error) => Promise.reject(error),
);

// Response Interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  // Handle error
  (error) => {
    // Handle expired token
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
