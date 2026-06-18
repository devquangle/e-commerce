package com.dev.backend.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    private final int code;
    private final String error;
    private final Object data; 

    public AppException(int code, String message) {
        super(message);
        this.code = code;
        this.error = null;
        this.data = null;
    }

    public AppException(int code, String message, String error) {
        super(message);
        this.code = code;
        this.error = error;
        this.data = null;
    }
}