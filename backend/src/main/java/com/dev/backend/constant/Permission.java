package com.dev.backend.constant;

import lombok.Getter;

@Getter
public enum Permission {
    // Product
    PRODUCT_READ(Module.PRODUCT, "Xem sản phẩm"),
    PRODUCT_CREATE(Module.PRODUCT, "Tạo sản phẩm"),
    PRODUCT_UPDATE(Module.PRODUCT, "Sửa sản phẩm"),
    PRODUCT_DELETE(Module.PRODUCT, "Xóa sản phẩm"),

    // Order
    ORDER_READ(Module.ORDER, "Xem đơn hàng"),
    ORDER_APPROVE(Module.ORDER, "Duyệt đơn hàng"),
    ORDER_CANCEL(Module.ORDER, "Hủy đơn hàng"),

    // Author
    AUTHOR_READ(Module.AUTHOR, "Xem tác giả"),
    AUTHOR_CREATE(Module.AUTHOR, "Tạo tác giả"),
    AUTHOR_UPDATE(Module.AUTHOR, "Sửa tác giả"),
    AUTHOR_DELETE(Module.AUTHOR, "Xóa tác giả"),

    // Publisher
    PUBLISHER_READ(Module.PUBLISHER, "Xem nhà xuất bản"),
    PUBLISHER_CREATE(Module.PUBLISHER, "Tạo nhà xuất bản"),
    PUBLISHER_UPDATE(Module.PUBLISHER, "Sửa nhà xuất bản"),
    PUBLISHER_DELETE(Module.PUBLISHER, "Xóa nhà xuất bản"),

    // Promotion
    PROMOTION_READ(Module.PROMOTION, "Xem khuyến mãi"),
    PROMOTION_CREATE(Module.PROMOTION, "Tạo khuyến mãi"),
    PROMOTION_UPDATE(Module.PROMOTION, "Sửa khuyến mãi"),
    PROMOTION_DELETE(Module.PROMOTION, "Xóa khuyến mãi"),

    // Genre
    GENRE_READ(Module.GENRE, "Xem thể loại"),
    GENRE_CREATE(Module.GENRE, "Tạo thể loại"),
    GENRE_UPDATE(Module.GENRE, "Sửa thể loại"),
    GENRE_DELETE(Module.GENRE, "Xóa thể loại"),

    // System
    SUPER_ADMIN(Module.SYSTEM, "Toàn quyền"),
    ADMIN(Module.SYSTEM, "Quản trị viên"),

    // Customer
    CUSTOMER(Module.USER, "Khách hàng");

    private final Module module;
    private final String description;

    Permission(Module module, String description) {
        this.module = module;
        this.description = description;
    }
}
