package com.dev.backend.constant;

import com.dev.backend.exception.BadRequestException;

public enum BaseStatus {
    ACTIVE,
    INACTIVE,
    DELETED;

    
public static BaseStatus from(String status) {
    if (status == null || status.isBlank()) {
        return null;
    }

    try {
        return BaseStatus.valueOf(status.toUpperCase());
    } catch (Exception e) {
        throw new BadRequestException("Invalid status: " + status);
    }
}
}