package com.dev.backend.constant;
import lombok.Getter;
@Getter
public enum ProductBadge {

    FLASH_SALE(1),
    BEST_SELLER(2),
    NEW(3);

    private final int priority;

    ProductBadge(int priority) {
        this.priority = priority;
    }

}