import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getToken, setToken, removeToken } from "@/utils/cookieUtil";
import type { ApiResponse } from "@/types/api-response";
import type { RefreshTokenResponse } from "@/types/auth";
import { AUTH_ENDPOINT, AUTH_STORAGE_KEY, TOKEN_KEY } from "@/constants/token";

export const baseURL = "http://localhost:8080";

/* ================= INSTANCES ================= */

export const apiGuest = axios.create({
  baseURL,
  withCredentials: true,
});

export const apiAuth = axios.create({
  baseURL,
  withCredentials: true,
});

/* ================= REQUEST ================= */

apiAuth.interceptors.request.use((config) => {
  const token = getToken(TOKEN_KEY.ACCESS_TOKEN);

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= REFRESH ================= */

let isRefreshing = false;
let subscribers: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const subscribe = (
  resolve: (token: string) => void,
  reject: (error: unknown) => void
) => {
  subscribers.push({ resolve, reject });
};

const onRefreshed = (token: string) => {
  subscribers.forEach((subscriber) => subscriber.resolve(token));
  subscribers = [];
};

const onRefreshFailed = (error: unknown) => {
  subscribers.forEach((subscriber) => subscriber.reject(error));
  subscribers = [];
};

const redirectToLogin = () => {
  removeToken(TOKEN_KEY.ACCESS_TOKEN);
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const isManualLogout = () =>
  sessionStorage.getItem(AUTH_STORAGE_KEY.MANUAL_LOGOUT) === "1";

/* ================= RESPONSE ================= */

apiAuth.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    // Stop refresh loop if refresh endpoint itself fails.
    if (originalRequest?.url?.includes(AUTH_ENDPOINT.REFRESH_TOKEN)) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // Already retried or request metadata missing.
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Some backends return 401, others return 403 for expired/invalid access token.
    if (status !== 401 && status !== 403) {
      return Promise.reject(error);
    }

    // User explicitly logged out, do not auto-refresh into authenticated state.
    if (isManualLogout()) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribe(
          (token) => {
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
      const { data } = await apiGuest.post<ApiResponse<RefreshTokenResponse>>(
        AUTH_ENDPOINT.REFRESH_TOKEN
      );

      if (!data.success || !data.data?.accessToken) {
        throw new Error("Refresh failed");
      }

      const newToken = data.data.accessToken;

      setToken(TOKEN_KEY.ACCESS_TOKEN, newToken);
      onRefreshed(newToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      return apiAuth(originalRequest);
    } catch (err) {
      onRefreshFailed(err);
      redirectToLogin();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);