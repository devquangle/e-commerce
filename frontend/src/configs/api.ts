import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken, setToken } from "@/utils/cookieUtil";

export const baseURL = "http://localhost:8080";

/* ================== API AUTH ================== */
export const apiAuth = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================== REQUEST INTERCEPTOR ================== */
apiAuth.interceptors.request.use(
  (config) => {
    const token = getToken("JWT_TOKEN");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================== REFRESH TOKEN LOGIC ================== */
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

/* ================== RESPONSE INTERCEPTOR ================== */
apiAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // ❗ nếu chính request refresh bị lỗi → logout luôn
    if (originalRequest?.url?.includes("/auth/refresh-token")) {
      removeToken("JWT_TOKEN");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 🔥 Nếu đang refresh → chờ
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiAuth(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await apiGuest.post("/refresh-token");

        // ❗ validate response
        if (!data?.success || !data?.data?.accessToken) {
          throw new Error("Refresh token invalid");
        }

        const newToken = data.data.accessToken;

        // lưu token
        setToken("JWT_TOKEN", newToken);

        // update global header
        apiAuth.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // gọi lại các request đang chờ
        onRefreshed(newToken);

        // retry request cũ
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return apiAuth(originalRequest);
      } catch (err) {
        removeToken("JWT_TOKEN");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ================== API GUEST ================== */
export const apiGuest = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});