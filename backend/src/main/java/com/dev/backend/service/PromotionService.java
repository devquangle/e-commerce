package com.dev.backend.service;

import com.dev.backend.dto.promotion.PromotionFilter;
import com.dev.backend.dto.promotion.PromotionRequest;
import com.dev.backend.dto.promotion.PromotionResponse;
import com.dev.backend.entity.Promotion;
import com.dev.backend.response.PageResponse;

public interface PromotionService {
    void insertData();

    Promotion savePromotion(Promotion promotion);

    Promotion findById(Integer id);

    void validate(PromotionRequest promotionRequest);

    Promotion addPromotion(PromotionRequest promotionRequest);

    PageResponse<PromotionResponse> search(PromotionFilter filter);

}
