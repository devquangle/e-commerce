import { getToken, removeToken, setToken } from "@/utils/cookieUtil";

export const baseURL = "http://localhost:8080";
import axios, { AxiosError} from "axios";
import type { InternalAxiosRequestConfig } from 'axios';


export const apiAuth = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiAuth.interceptors.request.use(
  (config) => {
    const token = getToken("JWT_TOKEN"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await apiAuth.post("/auth/refresh-token");

        const newToken = (res.data as { accessToken: string }).accessToken;

        setToken("JWT_TOKEN", newToken);

        // 🔥 gắn token mới
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // 🔥 gọi lại request cũ
        return apiAuth(originalRequest);

      } catch (err) {
        removeToken("JWT_TOKEN");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);



export const apiGuest = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

