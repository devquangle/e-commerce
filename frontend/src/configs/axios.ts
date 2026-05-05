import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken, setToken } from "@/utils/cookieUtil";
import type { ApiResponse } from "@/types/api-response";

/* ================= BASE ================= */
export const baseURL = "http://localhost:8080";

/* ================= AXIOS INSTANCES ================= */
export const apiGuest = axios.create({
  baseURL,
  withCredentials: true,
});

export const apiAuth = axios.create({
  baseURL,
  withCredentials: true,
});

/* ================= COMMON RESPONSE ================= */

/* ================= REFRESH RESPONSE ================= */
interface RefreshData {
  accessToken: string;
}

type RefreshResponse = ApiResponse<RefreshData>;

/* ================= HELPER ================= */
const redirectToLogin = () => {
  removeToken("JWT_TOKEN");
  delete apiAuth.defaults.headers.common["Authorization"];
  window.location.href = "/login";
};

/* ================= REQUEST INTERCEPTOR ================= */
apiAuth.interceptors.request.use(
  (config) => {
    const token = getToken("JWT_TOKEN");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ================= REFRESH QUEUE ================= */
let isRefreshing = false;

type Subscriber = {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
};

let subscribers: Subscriber[] = [];

const subscribe = (
  resolve: (token: string) => void,
  reject: (error: AxiosError) => void
) => {
  subscribers.push({ resolve, reject });
};

const onRefreshed = (token: string) => {
  subscribers.forEach((s) => s.resolve(token));
  subscribers = [];
};

const onFailed = (error: AxiosError) => {
  subscribers.forEach((s) => s.reject(error));
  subscribers = [];
};

/* ================= RESPONSE INTERCEPTOR ================= */
apiAuth.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    /* ❗ Nếu refresh fail */
    if (originalRequest?.url?.includes("/auth/refresh-token")) {
      redirectToLogin();
      return Promise.reject(error);
    }

    /* ================= HANDLE 401 ================= */
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      /* 🔥 đang refresh → queue */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribe(
            (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiAuth(originalRequest));
            },
            reject
          );
        });
      }

      isRefreshing = true;

      try {
        const { data } = await apiGuest.post<RefreshResponse>(
          "/auth/refresh-token"
        );

        if (!data.success || !data.data?.accessToken) {
          throw new Error("Invalid refresh response");
        }

        const newToken = data.data.accessToken;

        setToken("JWT_TOKEN", newToken);

        apiAuth.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;

        onRefreshed(newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return apiAuth(originalRequest);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          onFailed(err);
          redirectToLogin();
          return Promise.reject(err);
        }

        const unknownError = new AxiosError(
          "Unknown refresh token error",
          "ERR_UNKNOWN"
        );
        onFailed(unknownError);
        redirectToLogin();
        return Promise.reject(unknownError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);