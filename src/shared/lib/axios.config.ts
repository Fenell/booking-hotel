import axios from "axios";
import { API_BASE_URL } from "../../../config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "X-Api-Version": 1.0 },
});

// Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // handle 401 / refresh token / logout
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
