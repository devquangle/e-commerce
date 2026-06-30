package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.promotion.PromotionProductRequest;
import com.dev.backend.entity.Promotion;
import com.dev.backend.entity.PromotionProduct;


public interface PromotionProductService {
    PromotionProduct savePromotionProduct(PromotionProduct promotionProduct);

    void savePromotionProducts (Promotion promotion,List<PromotionProductRequest> promotionProducts);
}
