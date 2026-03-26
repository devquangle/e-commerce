package com.dev.backend.util;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

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
    public static  ResponseEntity<ResponseData> errorValidation(String message, BindingResult result) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(error -> 
            errors.putIfAbsent(error.getField(), error.getDefaultMessage())
        );
        ResponseData rps = new ResponseData(false, message, errors, LocalDateTime.now());
        return ResponseEntity.badRequest().body(rps);
    }
}
