package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.promotion.PromotionResponse;
import com.dev.backend.entity.Promotion;

@Component
public class PromotionMapper {
    public PromotionResponse toDTO(Promotion promotion) {
        if (promotion == null) {
            return null;
        }
        PromotionResponse response = new PromotionResponse();
        response.setId(promotion.getId());
        response.setName(promotion.getName());
        response.setStartDate(promotion.getStartDate().toString());
        response.setEndDate(promotion.getExpireDate().toString());
        response.setStatus(promotion.getStatus());
        response.setPromotionCampaignType(promotion.getPromotionCampaignType());
        return response;
    }
}
