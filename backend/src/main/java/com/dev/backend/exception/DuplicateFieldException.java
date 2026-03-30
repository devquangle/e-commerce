package com.dev.backend.exception;

import java.util.HashMap;
import java.util.Map;
public class DuplicateFieldException extends AppException {

    private final Map<String, String> errors;

    public DuplicateFieldException(Map<String, String> errors) {
        super(400, "Validation failed");
        this.errors = new HashMap<>(errors);
    }

    public DuplicateFieldException(String field, String message) {
        super(400, "Validation failed");
        this.errors = new HashMap<>();
        this.errors.put(field, message);
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public DuplicateFieldException addError(String field, String message) {
        this.errors.put(field, message);
        return this;
    }
}