import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { API_BASE_URL } from "../../../config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "X-Api-Version": 1.0 },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Function get_data của Postgres trả snake_case, các endpoint REST trả
    // camelCase — chuẩn hoá hết về camelCase ngay tại đây để phía trên chỉ
    // phải biết một quy ước. Đặt cùng chỗ tạo instance thay vì trong một file
    // service, nếu không hành vi của toàn app sẽ phụ thuộc thứ tự import.
    response.data = camelcaseKeys(response.data, { deep: true });
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      // handleErrorResponse(response);

      if (response.status === 401) {
        // document.cookie =
        //   "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
      }
    } else if (error.request) {
      // showErrorToast("NETWORK_ERROR");
    } else {
      // showErrorToast("DEFAULT_ERROR");
    }

    return Promise.reject(error);
  },
);

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // handle 401 / refresh token / logout
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
