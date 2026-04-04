/**
 * Đồng bộ với `com.dev.backend.resp.ApiErrorCode`.
 * Backend cũng có thể gửi `error` là tên HttpStatus (vd. BAD_REQUEST) khi AppException không set error.
 */
export const ApiErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TYPE_MISMATCH: "TYPE_MISMATCH",
  ACCESS_DENIED: "ACCESS_DENIED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

export function isApiErrorCode(value: string): value is ApiErrorCode {
  return (Object.values(ApiErrorCode) as string[]).includes(value);
}
