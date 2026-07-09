package com.dev.backend.constant;
public enum OrderStatus {
    PENDING,        // Chờ xác nhận
    CONFIRMED,      // Đã xác nhận
    SHIPPING,       // Đang giao
    DELIVERED,      // Đã giao
    COMPLETED,      // Hoàn tất (hết thời gian đổi trả)
    CANCELLED,      // Hủy trước khi giao
    // RETURNED,       // Đã trả hàng
    FAILED_DELIVERY // Giao thất bại (bom hàng, không liên lạc được...)
}