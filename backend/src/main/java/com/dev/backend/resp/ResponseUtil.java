package com.dev.backend.resp;

import org.springframework.http.ResponseEntity;

public final class ResponseUtil {
    public static ResponseEntity<ResponseData> success(String message, Object data) {
        ResponseData response = ResponseData.builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
        return ResponseEntity.ok(response);
    }
}