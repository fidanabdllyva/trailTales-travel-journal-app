import axios from "axios";
import { refreshToken } from "./requests/authService";
import { API_BASE_URL } from "./constants";
import { getAccessToken, logoutUser, setAccessToken } from "@/utils/authHelpers";

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // IMPORTANT: send cookies automatically
});

// Attach access token from storage to every request
instance.interceptors.request.use((config) => {
  const token = getAccessToken(); // get from localStorage or sessionStorage
  if (token) {
    if (!config.headers) config.headers = {} as import("axios").AxiosRequestHeaders;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// To queue requests during refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error & request not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") // avoid infinite loop on refresh endpoint
    ) {
      if (isRefreshing) {
        // If refresh already in progress, queue requests
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (!originalRequest.headers) originalRequest.headers = {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshToken(); // call refresh endpoint (sends cookie automatically)
        const newAccessToken = response.data.accessToken;

        setAccessToken(newAccessToken); // save new token

        // Update default Authorization header
        instance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logoutUser(); // clear tokens, redirect to login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
