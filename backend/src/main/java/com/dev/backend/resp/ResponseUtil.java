package com.dev.backend.resp;

import org.springframework.http.ResponseEntity;

public final class ResponseUtil {
    private ResponseUtil() {}

    public static <T> ResponseEntity<ResponseData<T>> success(String message, T data) {
        ResponseData<T> response = ResponseData.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
        return ResponseEntity.ok(response);
    }
}