import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { getErrorMessage } from "./error";

/**
 * Chuyển lỗi server thành lỗi form và set lên react-hook-form
 * @param error AxiosError từ server
 * @param setError hàm setError từ useForm
 * @param showErrorToast hàm hiển thị toast (tùy chọn)
 */
export function mapServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  showErrorToast?: (msg: string) => void,
) {
  if (axios.isAxiosError(error)) {
    const serverData = error.response?.data;

    // Nếu server trả về object lỗi theo field
    if (
      serverData &&
      typeof serverData === "object" &&
      "data" in serverData &&
      serverData.data &&
      typeof serverData.data === "object"
    ) {
      Object.entries(serverData.data).forEach(([field, message]) => {
        setError(field as Path<T>, {
          type: "server",
          message: String(message),
        });
      });
      return;
    }

    // Nếu không có object lỗi, show toast
    showErrorToast?.(getErrorMessage(error));
  } else {
    // Lỗi không phải Axios, show toast
    showErrorToast?.(getErrorMessage(error));
  }
}