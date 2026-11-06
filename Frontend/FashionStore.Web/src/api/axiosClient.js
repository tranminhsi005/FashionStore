import axios from "axios";

import {
  layAccessToken,
  datAccessToken,
  xoaAccessToken,
  thongBaoHetPhien,
} from "./tokenStore";

// URL Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios dùng cho API thông thường
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios riêng để gọi refresh token
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Biến dùng để tránh nhiều request refresh cùng lúc
let refreshPromise = null;

// =====================================================
// LÀM MỚI ACCESS TOKEN
// =====================================================

export function lamMoiAccessToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/lam-moi-token", null, {
        headers: {
          "X-Auth-Action": "1",
        },
      })
      .then(function (response) {
        // Backend trả accessToken bên trong data.data
        const token = response.data?.data?.accessToken;

        if (!token) {
          throw new Error("Backend không trả về access token mới.");
        }

        datAccessToken(token);

        return token;
      })
      .catch(function (error) {
        xoaAccessToken();

        throw error;
      })
      .finally(function () {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// =====================================================
// REQUEST INTERCEPTOR
// Tự động thêm Bearer Token
// =====================================================

axiosClient.interceptors.request.use(
  function (config) {
    const token = layAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  function (error) {
    return Promise.reject(error);
  },
);

// =====================================================
// RESPONSE INTERCEPTOR
// Xử lý lỗi 401 và refresh token
// =====================================================

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },

  async function (error) {
    const originalRequest = error.config;

    // Không phải lỗi 401 thì trả lỗi bình thường
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Không có request gốc hoặc đã retry rồi
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Không refresh đối với những API xác thực này
    const authUrls = [
      "/auth/dang-nhap",
      "/auth/dang-ky",
      "/auth/lam-moi-token",
      "/auth/dang-xuat",
    ];

    const isAuthRequest = authUrls.some(function (url) {
      return originalRequest.url?.includes(url);
    });

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    // Không có access token thì không thử refresh ở đây
    if (!layAccessToken()) {
      return Promise.reject(error);
    }

    // Đánh dấu request đã được retry
    originalRequest._retry = true;

    try {
      // Làm mới access token
      const newToken = await lamMoiAccessToken();

      // Gắn token mới vào request cũ
      originalRequest.headers = originalRequest.headers || {};

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      // Gửi lại request ban đầu
      return axiosClient(originalRequest);
    } catch (refreshError) {
      xoaAccessToken();

      // Thông báo AuthContext rằng phiên đã hết hạn
      thongBaoHetPhien();

      return Promise.reject(refreshError);
    }
  },
);

export default axiosClient;
