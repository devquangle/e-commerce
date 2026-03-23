package com.dev.backend.enums;

public enum PermissionEnum {

    // Product
    PRODUCT_CREATE(Module.PRODUCT, ActionType.CREATE),
    PRODUCT_UPDATE(Module.PRODUCT, ActionType.UPDATE),
    PRODUCT_DELETE(Module.PRODUCT, ActionType.DELETE),
    PRODUCT_VIEW(Module.PRODUCT, ActionType.READ),

    // Category
    CATEGORY_CREATE(Module.GENRE, ActionType.CREATE),
    CATEGORY_UPDATE(Module.GENRE, ActionType.UPDATE),
    CATEGORY_DELETE(Module.GENRE, ActionType.DELETE),
    CATEGORY_VIEW(Module.GENRE, ActionType.READ),

    // Order
    ORDER_VIEW(Module.ORDER, ActionType.READ),
    ORDER_UPDATE(Module.ORDER, ActionType.UPDATE),
    ORDER_CANCEL(Module.ORDER, ActionType.DELETE),

    // Promotion
    PROMOTION_CREATE(Module.PROMOTION, ActionType.CREATE),
    PROMOTION_UPDATE(Module.PROMOTION, ActionType.UPDATE),
    PROMOTION_DELETE(Module.PROMOTION, ActionType.DELETE),
    PROMOTION_VIEW(Module.PROMOTION, ActionType.READ),
    PROMOTION_REPORT(Module.PROMOTION, ActionType.REPORT),

    // Content
    CONTENT_EDIT(Module.CONTENT, ActionType.UPDATE),
    CONTENT_VIEW(Module.CONTENT, ActionType.READ),

    // Customer / User
    CUSTOMER_RESET_PASSWORD(Module.CUSTOMER, ActionType.RESET_PASSWORD),

    // Support tasks
    SUPPORT_TASK(Module.SUPPORT, ActionType.TASK);

    private final Module module;
    private final ActionType action;

    PermissionEnum(Module module, ActionType action) {
        this.module = module;
        this.action = action;
    }

    public Module getModule() { return module; }
    public ActionType getAction() { return action; }
    public String getCode() { return module.name() + "_" + action.name(); }
}