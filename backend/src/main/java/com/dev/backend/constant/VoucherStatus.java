package com.dev.backend.constant;

import com.dev.backend.exception.BadRequestException;

public enum VoucherStatus {
    ACTIVE,
    INACTIVE,
    DELETED;

    public static VoucherStatus from(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        try {
            return valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid voucher status.");
        }
    }
}