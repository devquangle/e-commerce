package com.dev.backend.resp;

/**
 * Mã chuỗi trong {@link ResponseData#error} cho các lỗi chuẩn hóa.
 * Đồng bộ với frontend: {@code frontend/src/constants/api-error-code.ts}.
 * <p>
 * Các {@link com.dev.backend.exception.AppException} có thể gửi thêm mã tùy chỉnh hoặc
 * tên {@link org.springframework.http.HttpStatus} (ví dụ {@code BAD_REQUEST}) khi {@code error} không set.
 */
public final class ApiErrorCode {

    private ApiErrorCode() {}

    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String TYPE_MISMATCH = "TYPE_MISMATCH";
    public static final String ACCESS_DENIED = "ACCESS_DENIED";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    public static final String INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
}
