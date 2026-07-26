package com.dev.backend.constant;

import com.dev.backend.exception.BadRequestException;

public enum OrderStatus {
    PENDING,        // Chờ xác nhận
    CONFIRMED,      // Đã xác nhận
    SHIPPING,       // Đang giao
    DELIVERED,      // Đã giao
    COMPLETED,      // Hoàn tất (hết thời gian đổi trả)
    CANCELLED,      // Hủy trước khi giao
    // RETURNED,       // Đã trả hàng
    FAILED_DELIVERY; // Giao thất bại (bom hàng, không liên lạc được...)

      public static OrderStatus from(String status) {
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