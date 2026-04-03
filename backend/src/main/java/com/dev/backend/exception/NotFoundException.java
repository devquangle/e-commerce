package com.dev.backend.exception;

public class NotFoundException extends AppException {
    public NotFoundException(String message) {
        super(404, message);
    }
}