import axios from "axios";
import { API_BASE_URL } from "./constants";

const instance = axios.create({
  baseURL: API_BASE_URL|| "http://localhost:7070",
});

const token = localStorage.getItem("token");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
