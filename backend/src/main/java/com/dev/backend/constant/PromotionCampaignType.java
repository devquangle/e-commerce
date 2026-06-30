package com.dev.backend.constant;

import com.dev.backend.exception.BadRequestException;

public enum PromotionCampaignType {
    FLASH_SALE,
    PRODUCT_DISCOUNT,
    SEASONAL;

    public static PromotionCampaignType from(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        try {
            return PromotionCampaignType.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
