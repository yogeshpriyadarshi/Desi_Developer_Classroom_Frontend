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
    return Promise.reject(error);
  },
);

export default axiosInstance;
