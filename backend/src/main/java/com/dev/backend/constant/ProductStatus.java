package com.dev.backend.constant;

public enum ProductStatus {
    DRAFT,        // mới tạo
    ACTIVE,       // đang bán
    OUT_OF_STOCK, // hết hàng
    INACTIVE,     // admin tắt
    DELETED       // soft delete logic
}
