export type ResponseData<T = unknown> =
  | {
      success: true;
      message: string;
      data: T;
      timestamp: string;
    }
  | {
      success: false;
      message: string;
      /** Map lỗi theo field (VALIDATION_ERROR, DuplicateFieldException, …) */
      data?: Record<string, string> | null;

      code?: number;
      error?: string;
      path?: string;

      timestamp: string;
    };
