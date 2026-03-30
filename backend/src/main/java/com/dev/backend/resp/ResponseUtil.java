package com.dev.backend.resp;


import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
@Component
public class ResponseUtil {

    public static ResponseEntity<ResponseData> success(String message, Object data) {
        ResponseData rps = ResponseData.builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
        return ResponseEntity.ok(rps);
    }
}