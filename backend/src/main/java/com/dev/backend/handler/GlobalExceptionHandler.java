package com.dev.backend.handler;

import com.dev.backend.resp.ResponseData;
import com.dev.backend.exception.AppException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Custom AppException (NotFound, BadRequest, Unauthorized)
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ResponseData> handleAppException(
            AppException ex, HttpServletRequest request) {
        log.warn("AppException: {} - {}", ex.getCode(), ex.getMessage());

        ResponseData response = ResponseData.builder()
                .success(false)
                .message(ex.getMessage())
                .data(Map.of(
                        "error", ex.getClass().getSimpleName(),
                        "code", ex.getCode(),
                        "path", request.getRequestURI()
                ))
                .build();
        return ResponseEntity.status(ex.getCode()).body(response);
    }

    // Validation errors (@Valid, @UniqueEmail, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseData> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ResponseData response = ResponseData.builder()
                .success(false)
                .message("Dữ liệu không hợp lệ")
                .data(errors)
                .build();
        return ResponseEntity.badRequest().body(response);
    }

    // Generic exception fallback
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseData> handleGeneric(
            Exception ex, HttpServletRequest request) {
        log.error("Internal Server Error", ex);

        ResponseData response = ResponseData.builder()
                .success(false)
                .message("Lỗi hệ thống. Vui lòng thử lại sau.")
                .data(Map.of("path", request.getRequestURI()))
                .build();
        return ResponseEntity.status(500).body(response);
    }
}