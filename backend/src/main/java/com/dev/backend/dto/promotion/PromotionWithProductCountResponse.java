package com.dev.backend.dto.promotion;

import java.time.LocalDate;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.constant.PromotionCampaignType;

public record PromotionWithProductCountResponse(
        Integer id,
        String name,
        PromotionCampaignType promotionCampaignType,
        LocalDate startDate,
        LocalDate endDate,
        BaseStatus status,
        Long productCount) {
}