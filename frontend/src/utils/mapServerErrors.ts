import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { getErrorMessage } from "./error";

/**
 * Chuyển lỗi server thành lỗi form và set lên react-hook-form
 * Nếu server trả lỗi theo field, chỉ set error trên form, không show toast
 * Nếu không có field-specific error, show toast
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
      typeof serverData.data === "object" &&
      Object.keys(serverData.data).length > 0
    ) {
      // Chỉ set lỗi lên form, không show toast
      Object.entries(serverData.data).forEach(([field, message]) => {
        setError(field as Path<T>, {
          type: "server",
          message: String(message),
        });
      });
      showErrorToast?.(serverData.message ?? "Có lỗi xảy ra");

      return; 
    }

    // Nếu không có lỗi field, show toast
   showErrorToast?.(serverData?.message ?? "Có lỗi xảy ra");
  } else {
    // Lỗi không phải Axios, show toast
    showErrorToast?.(getErrorMessage(error));
  }
}
