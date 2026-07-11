package com.dev.backend.constant;

import lombok.Getter;

@Getter
public enum Permission {
    // Product
    PRODUCT_READ(Module.PRODUCT, "Xem sản phẩm"),
    PRODUCT_CREATE(Module.PRODUCT, "Thêm sản phẩm"),
    PRODUCT_UPDATE(Module.PRODUCT, "Cập nhật sản phẩm"),
    PRODUCT_DELETE(Module.PRODUCT, "Xóa sản phẩm"),

    // Order
    ORDER_READ(Module.ORDER, "Xem đơn hàng"),
    ORDER_APPROVE(Module.ORDER, "Duyệt đơn hàng"),
    ORDER_CANCEL(Module.ORDER, "Hủy đơn hàng"),

    // Author
    AUTHOR_READ(Module.AUTHOR, "Xem tác giả"),
    AUTHOR_CREATE(Module.AUTHOR, "Thêm tác giả"),
    AUTHOR_UPDATE(Module.AUTHOR, "Cập nhật tác giả"),
    AUTHOR_DELETE(Module.AUTHOR, "Xóa tác giả"),

    // Publisher
    PUBLISHER_READ(Module.PUBLISHER, "Xem nhà xuất bản"),
    PUBLISHER_CREATE(Module.PUBLISHER, "Thêm nhà xuất bản"),
    PUBLISHER_UPDATE(Module.PUBLISHER, "Cập nhật nhà xuất bản"),
    PUBLISHER_DELETE(Module.PUBLISHER, "Xóa nhà xuất bản"),

    // Promotion
    PROMOTION_READ(Module.PROMOTION, "Xem khuyến mãi"),
    PROMOTION_CREATE(Module.PROMOTION, "Thêm khuyến mãi"),
    PROMOTION_UPDATE(Module.PROMOTION, "Cập nhật khuyến mãi"),
    PROMOTION_DELETE(Module.PROMOTION, "Xóa khuyến mãi"),

    VOUCHER_READ(Module.VOUCHER, "Xem mã giảm giá"),
    VOUCHER_CREATE(Module.VOUCHER, "Thêm mã giảm giá"),
    VOUCHER_UPDATE(Module.VOUCHER, "Cập nhật mã giảm giá"),
    VOUCHER_DELETE(Module.VOUCHER, "Xoá mã giảm giá"),

    // Genre
    GENRE_READ(Module.GENRE, "Xem thể loại"),
    GENRE_CREATE(Module.GENRE, "Thêm thể loại"),
    GENRE_UPDATE(Module.GENRE, "Cập nhật thể loại"),
    GENRE_DELETE(Module.GENRE, "Xóa thể loại"),

    // support
    SUPPORT_READ(Module.SUPPORT, "Xem cuộc trò chuyện"),
    SUPPORT_REPLY(Module.SUPPORT, "Trả lời khách hàng"),
    
    // System
    SUPER_ADMIN(Module.SYSTEM, "Toàn quyền"),
    ADMIN(Module.SYSTEM, "Quản trị viên"),

    // Customer
    CUSTOMER(Module.CUSTOMER, "Khách hàng");

    private final Module module;
    private final String description;

    Permission(Module module, String description) {
        this.module = module;
        this.description = description;
    }
}
