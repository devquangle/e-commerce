import { isAxiosError } from "axios";
import type { ResponseData } from "@/types/response-data";

export const getErrorMessage = <T = unknown>(err: unknown): string => {
  if (!err) return "Có lỗi xảy ra";

  // Axios: ưu tiên message từ body backend (nếu có)
  if (isAxiosError<ResponseData<T>>(err) && err.response?.data && typeof err.response.data === "object") {
    const data = err.response.data;
    if ("message" in data && typeof data.message === "string" && data.message.length > 0) {
      return data.message;
    }
  }

  // Body thuần từ interceptor api / apiPublic khi reject(error.response?.data)
  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.length > 0) {
      return msg;
    }
  }

  if (isAxiosError<unknown>(err) && typeof err.message === "string" && err.message.length > 0) {
    return err.message;
  }

  return "Có lỗi xảy ra";
};
