import axios from "axios";
import { API_BASE_URL } from "./constants";

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json", // default
  },
});

// Request interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Automatically set multipart/form-data for FormData
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
