package com.dev.backend.service;

import com.dev.backend.dto.promotion.PromotionRequest;
import com.dev.backend.entity.Promotion;

public interface PromotionService {
    Promotion savePromotion(Promotion promotion);

    Promotion findById(Integer id);

    void validate(PromotionRequest promotionRequest);

    Promotion addPromotion(PromotionRequest promotionRequest);
}
