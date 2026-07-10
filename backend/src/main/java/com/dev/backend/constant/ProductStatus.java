package com.dev.backend.constant;

import com.dev.backend.exception.BadRequestException;

public enum ProductStatus {
    ACTIVE, // Hoạt động
    INACTIVE, // Ngừng hoạt động
    // OUT_OF_STOCK, // Hết hàng
    // PRE_ORDER, // Đặt trước
    // COMING_SOON, // Sắp ra mắt
    DELETED;// soft delete logic

    public static ProductStatus from(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        try {
            return ProductStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }

}
