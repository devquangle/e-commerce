package com.dev.backend.handler;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.dev.backend.exception.AppException;
import com.dev.backend.response.ApiErrorCode;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(AppException.class)
        public ResponseEntity<ResponseData<Object>> handleAppException(AppException ex, HttpServletRequest request) {
                HttpStatus status = HttpStatus.resolve(ex.getCode());
                if (status == null) {
                        status = HttpStatus.BAD_REQUEST;
                }
                String error = ex.getError() == null || ex.getError().isBlank() ? status.name() : ex.getError();

                return ResponseUtil.error(status, ex.getMessage(), error, request.getRequestURI(), ex.getData());
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ResponseData<Object>> handleMethodArgumentNotValid(
                        MethodArgumentNotValidException ex,
                        HttpServletRequest request) {
                Map<String, String> errors = new HashMap<>();
                for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
                        errors.put(fieldError.getField(), fieldError.getDefaultMessage());
                }

                return ResponseUtil.error(HttpStatus.BAD_REQUEST, "Dữ liệu không hợp lệ!", ApiErrorCode.VALIDATION_ERROR, request.getRequestURI(), errors);
        }

        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<ResponseData<Object>> handleConstraintViolation(
                        ConstraintViolationException ex,
                        HttpServletRequest request) {
                return ResponseUtil.error(HttpStatus.BAD_REQUEST, ex.getMessage(), ApiErrorCode.VALIDATION_ERROR, request.getRequestURI(), null);
        }

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ResponseData<Object>> handleTypeMismatch(
                        MethodArgumentTypeMismatchException ex,
                        HttpServletRequest request) {
                String message = "Invalid value for parameter: " + ex.getName();
                return ResponseUtil.error(HttpStatus.BAD_REQUEST, message, ApiErrorCode.TYPE_MISMATCH, request.getRequestURI(), null);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ResponseData<Object>> handleAccessDenied(
                        AccessDeniedException ex,
                        HttpServletRequest request) {
                return ResponseUtil.error(HttpStatus.FORBIDDEN, "You do not have permission to access this resource", ApiErrorCode.ACCESS_DENIED, request.getRequestURI(), null);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ResponseData<Object>> handleException(Exception ex, HttpServletRequest request) {
                log.error("Unhandled exception at {}", request.getRequestURI(), ex);
                return ResponseUtil.error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", ApiErrorCode.INTERNAL_SERVER_ERROR, request.getRequestURI(), null);
        }

        @ExceptionHandler({
                        org.springframework.security.authentication.BadCredentialsException.class,
                        org.springframework.security.core.userdetails.UsernameNotFoundException.class
        })
        public ResponseEntity<ResponseData<Object>> handleBadCredentials(
                        Exception ex,
                        HttpServletRequest request) {

                return ResponseUtil.error(HttpStatus.UNAUTHORIZED, "Tài khoản hoặc mật khẩu không đúng", ApiErrorCode.UNAUTHORIZED, request.getRequestURI(), null);
        }

        @ExceptionHandler(org.springframework.security.authentication.LockedException.class)
        public ResponseEntity<ResponseData<Object>> handleLocked(
                        Exception ex,
                        HttpServletRequest request) {

                return ResponseUtil.error(HttpStatus.UNAUTHORIZED, "Tài khoản đã bị khóa", ApiErrorCode.UNAUTHORIZED, request.getRequestURI(), null);
        }

        @ExceptionHandler(org.springframework.security.authentication.DisabledException.class)
        public ResponseEntity<ResponseData<Object>> handleDisabled(
                        Exception ex,
                        HttpServletRequest request) {

                return ResponseUtil.error(HttpStatus.UNAUTHORIZED, "Tài khoản chưa được kích hoạt", ApiErrorCode.UNAUTHORIZED, request.getRequestURI(), null);
        }
}