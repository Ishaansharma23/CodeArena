import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

if (!import.meta.env.VITE_API_URL) {
  console.warn("VITE_API_URL is not set. Falling back to http://localhost:3000/api");
}

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});

export default axiosInstance;
