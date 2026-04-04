export type ResponseData<T = unknown> =
  | {
      success: true;
      message: string;
      data: T | null;
      timestamp: string;
    }
  | ResponseDataError;

/** Lỗi từ API: `data` là map lỗi theo field (validation) hoặc bỏ qua. */
export type ResponseDataError = {
  success: false;
  message: string;
  data?: Record<string, string> | null;
  code?: number;
  error?: string;
  path?: string;
  timestamp: string;
};

export type ResponseDataSuccess<T = unknown> = Extract<
  ResponseData<T>,
  { success: true }
>;

/** Cùng pattern `yyyy-MM-dd HH:mm:ss` như `@JsonFormat` trên backend. */
export function formatResponseTimestamp(date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())} ${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}

/** Lỗi sinh trên client: luôn có `timestamp`, khớp `ResponseDataError`. */
export function clientResponseError(
  message: string,
  partial?: Partial<Omit<ResponseDataError, "success" | "message">>,
): ResponseDataError {
  return {
    success: false,
    message,
    ...partial,
    timestamp: partial?.timestamp ?? formatResponseTimestamp(),
  };
}
