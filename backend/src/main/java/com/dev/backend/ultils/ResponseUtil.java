package com.dev.backend.ultils;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.dev.backend.resp.ResponseData;
@Component
public class ResponseUtil {

    public static  ResponseEntity<ResponseData> success(String message, Object data) {
        ResponseData rps = new ResponseData(true, message, data, LocalDateTime.now());
        return ResponseEntity.ok(rps);
    }

    public static  ResponseEntity<ResponseData> error(String message, Object data) {
        ResponseData rps = new ResponseData(false, message, data, LocalDateTime.now());
        return ResponseEntity.badRequest().body(rps);
    }
}
