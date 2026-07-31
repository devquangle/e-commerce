package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.promotion.PromotionProductMappingResponse;
import com.dev.backend.dto.promotion.PromotionProductRequest;
import com.dev.backend.entity.CartItem;
import com.dev.backend.entity.OrderItem;
import com.dev.backend.entity.Product;
import com.dev.backend.entity.Promotion;
import com.dev.backend.entity.PromotionProduct;

public interface PromotionProductService {
    PromotionProduct savePromotionProduct(PromotionProduct promotionProduct);

    void addPromotionProducts(Promotion promotion, List<PromotionProductRequest> promotionProducts);

    void updatePromotionProducts(Promotion promotion, List<PromotionProductRequest> newProducts);

    List<PromotionProductMappingResponse> promotionMappingResponses(List<Integer> productIds);

    Integer  getCurrentDiscountPercent(Integer productId);

    List<PromotionProduct> findActivePromotions(List<Integer> productIds);

    void reservePromotions(List<CartItem> cartItems);

    void releasePromotions(List<OrderItem> orderItems);

    void confirmPromotions(List<OrderItem> orderItems);
}
