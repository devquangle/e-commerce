import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getToken, setToken, removeToken } from "@/utils/cookieUtil";
import type { ResponseData } from "@/types/response-data";

const baseURL = "http://localhost:8080";

/** Client sau interceptor: Promise trả về `ResponseData.data`, không phải AxiosResponse */
export type UnwrappedAxios = Omit<
  AxiosInstance,
  "get" | "delete" | "head" | "options" | "post" | "put" | "patch" | "request"
> & {
  <T = unknown>(config: InternalAxiosRequestConfig): Promise<T>;
  request<T = unknown>(config: InternalAxiosRequestConfig): Promise<T>;
  get<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  head<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  options<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T>;
};

function createUnwrappedClient(): UnwrappedAxios {
  return axios.create({ baseURL, withCredentials: true }) as UnwrappedAxios;
}

// ================= INSTANCES =================
export const api = createUnwrappedClient();
export const apiPublic = createUnwrappedClient();

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken("JWT_TOKEN");
  if (token) {
    config.headers = new AxiosHeaders(config.headers);
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// ================= RESPONSE HANDLER =================
const handleResponse = <T>(res: AxiosResponse<ResponseData<T>>) => {
  const body = res.data;
  if (body == null || typeof body !== "object" || !("success" in body)) {
    throw { success: false as const, message: "Phản hồi server không hợp lệ" };
  }
  if (!body.success) throw body;
  return body.data;
};

// ================= TOKEN REFRESH =================
let isRefreshing = false;
let queue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (err: unknown, token?: string) => {
  queue.forEach(p => (err ? p.reject(err) : p.resolve(token!)));
  queue = [];
};

// ================= ERROR HANDLER =================
const handleError = async (error: AxiosError<ResponseData<unknown>>) => {
  const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (!error.response) return Promise.reject({ success: false, message: "Server unreachable" });

  const status = error.response.status;
  const data = error.response.data;

  if (status === 401 && !original._retry) {
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) =>
        queue.push({
          resolve: (t) =>
            resolve(
              api({
                ...original,
                headers: new AxiosHeaders(original.headers).set("Authorization", `Bearer ${t}`),
              })
            ),
          reject,
        })
      );
    }

    isRefreshing = true;

    try {
      const payload = await apiPublic.post<{ token: string }>("/auth/refresh");
      if (!payload?.token) throw { success: false as const, message: "Refresh token không hợp lệ" };

      const newToken = payload.token;
      setToken("JWT_TOKEN", newToken);
      processQueue(null, newToken);

      return api({
        ...original,
        headers: new AxiosHeaders(original.headers).set("Authorization", `Bearer ${newToken}`),
      });
    } catch (err) {
      processQueue(err);
      removeToken("JWT_TOKEN");
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(data ?? { success: false, message: "Unknown backend error" });
};

// ================= APPLY INTERCEPTORS =================
api.interceptors.response.use(handleResponse, handleError);
apiPublic.interceptors.response.use(
  handleResponse,
  (error) => Promise.reject(error.response?.data ?? { success: false, message: "Unknown backend error" })
);