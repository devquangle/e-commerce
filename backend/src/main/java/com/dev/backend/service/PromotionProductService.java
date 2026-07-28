package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.promotion.PromotionProductMappingResponse;
import com.dev.backend.dto.promotion.PromotionProductRequest;
import com.dev.backend.entity.Product;
import com.dev.backend.entity.Promotion;
import com.dev.backend.entity.PromotionProduct;

public interface PromotionProductService {
    PromotionProduct savePromotionProduct(PromotionProduct promotionProduct);

    void addPromotionProducts(Promotion promotion, List<PromotionProductRequest> promotionProducts);

    void updatePromotionProducts(Promotion promotion, List<PromotionProductRequest> newProducts);

    List<PromotionProductMappingResponse> promotionMappingResponses(List<Integer> productIds);

    Integer getDiscountValueByProductId(Integer productId);

    Integer calculateSalePrice(Product product);

    PromotionProduct findActivePromotion(Integer productId);

    // public void reserveQuantity(Integer productId, Integer quantity);

    // public void confirmQuantity(Integer productId, Integer quantity);

    // public void releaseReservedQuantity(Integer productId, Integer quantity);
}
