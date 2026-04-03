import type { ResponseData } from "@/types/response-data";
import type { FieldValues, UseFormSetError, Path } from "react-hook-form";

export const mapServerErrors = <TForm extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TForm>
) => {
  if (!error || typeof error !== "object") {
    console.warn("mapServerErrors nhận lỗi không phải object:", error);
    return;
  }

  const err = error as ResponseData<Record<string, string>>;

  if (!err.data || typeof err.data !== "object") {
    console.warn("mapServerErrors không tìm thấy data trong lỗi:", error);
    return;
  }

  Object.entries(err.data).forEach(([field, message]) => {
    if (typeof message !== "string") {
      console.warn(`Giá trị message cho field ${field} không phải string:`, message);
      return;
    }

    setError(field as Path<TForm>, {
      type: "server",
      message,
    });
  });
};