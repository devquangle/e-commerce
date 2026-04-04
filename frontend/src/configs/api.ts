import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getToken, setToken, removeToken } from "@/utils/cookieUtil";
import {
  clientResponseError,
  type ResponseData,
  type ResponseDataSuccess,
} from "@/types/response-data";

export const baseURL = "http://localhost:8080";

/** Client sau interceptor: Promise trả về `ResponseData.data` (có thể null khi success), không phải AxiosResponse */
export type UnwrappedAxios = Omit<
  AxiosInstance,
  "get" | "delete" | "head" | "options" | "post" | "put" | "patch" | "request"
> & {
  <T = unknown>(config: InternalAxiosRequestConfig): Promise<T | null>;
  request<T = unknown>(config: InternalAxiosRequestConfig): Promise<T | null>;
  get<T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig,
  ): Promise<T | null>;
  delete<T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig,
  ): Promise<T | null>;
  head<T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig,
  ): Promise<T | null>;
  options<T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig,
  ): Promise<T | null>;
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig,
  ): Promise<T | null>;
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig,
  ): Promise<T | null>;
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig,
  ): Promise<T | null>;
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
/** Axios type trả về AxiosResponse; thực tế unwrap thành ResponseData.data (cast khi .use). */
const handleResponse = <T>(res: AxiosResponse<ResponseData<T>>): T | null => {
  const body = res.data;
  if (body == null || typeof body !== "object" || !("success" in body)) {
    throw clientResponseError("Phản hồi server không hợp lệ");
  }
  if (!body.success) throw body;
  return body.data ?? null;
};

/** POST không Bearer: trả nguyên envelope (cần `message` khi `data` null). */
export async function postPublicEnvelope<T = unknown>(
  url: string,
  body?: unknown,
): Promise<ResponseDataSuccess<T>> {
  const res = await axios.post<ResponseData<T>>(`${baseURL}${url}`, body, {
    withCredentials: true,
  });
  const payload = res.data;
  if (
    payload == null ||
    typeof payload !== "object" ||
    !("success" in payload)
  ) {
    throw clientResponseError("Phản hồi server không hợp lệ");
  }
  if (!payload.success) throw payload;
  return payload;
}

// ================= TOKEN REFRESH =================
let isRefreshing = false;
let queue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (err: unknown, token?: string) => {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  queue = [];
};

// ================= ERROR HANDLER =================
const handleError = async (error: AxiosError<ResponseData<unknown>>) => {
  const original = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  if (!error.response)
    return Promise.reject(clientResponseError("Server unreachable"));

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
                headers: new AxiosHeaders(original.headers).set(
                  "Authorization",
                  `Bearer ${t}`,
                ),
              }),
            ),
          reject,
        }),
      );
    }

    isRefreshing = true;

    try {
      const payload = await apiPublic.post<{ token: string }>("/auth/refresh");
      if (!payload?.token)
        throw clientResponseError("Refresh token không hợp lệ");

      const newToken = payload.token;
      setToken("JWT_TOKEN", newToken);
      processQueue(null, newToken);

      return api({
        ...original,
        headers: new AxiosHeaders(original.headers).set(
          "Authorization",
          `Bearer ${newToken}`,
        ),
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

  return Promise.reject(
    data ?? clientResponseError("Unknown backend error"),
  );
};

// ================= APPLY INTERCEPTORS =================
api.interceptors.response.use(handleResponse as never, handleError);
apiPublic.interceptors.response.use(handleResponse as never, (error) =>
  Promise.reject(
    error.response?.data ?? clientResponseError("Unknown backend error"),
  ),
);
