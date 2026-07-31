package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.dto.promotion.PromotionProductMappingResponse;
import com.dev.backend.dto.promotion.PromotionProductRequest;
import com.dev.backend.entity.CartItem;
import com.dev.backend.entity.OrderItem;
import com.dev.backend.entity.Promotion;
import com.dev.backend.entity.PromotionProduct;
import com.dev.backend.repository.PromotionProductRepository;
import com.dev.backend.service.ProductService;
import com.dev.backend.service.PromotionProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromotionProductServiceImpl implements PromotionProductService {

    private final PromotionProductRepository promotionProductRepository;
    private final ProductService productService;

    @Override
    public PromotionProduct savePromotionProduct(PromotionProduct promotionProduct) {
        return promotionProductRepository.save(promotionProduct);
    }

    @Override
    @Transactional
    public void addPromotionProducts(
            Promotion promotion,
            List<PromotionProductRequest> requests) {

        List<PromotionProduct> entities = new ArrayList<>();

        for (PromotionProductRequest item : requests) {

            PromotionProduct pp = new PromotionProduct();

            pp.setPromotion(promotion);
            pp.setProduct(productService.findById(item.getProductId()));
            pp.setDiscountValue(item.getLocalDiscount());
            pp.setMaxQuantity(item.getLocalQty());
            pp.setSoldQuantity(0);
            pp.setReservedQuantity(0);
            entities.add(pp);
        }

        promotionProductRepository.saveAll(entities);
    }

    @Override
    @Transactional
    public void updatePromotionProducts(Promotion promotion, List<PromotionProductRequest> newProducts) {
        promotionProductRepository.deleteByPromotionId(promotion.getId());

        List<PromotionProduct> entities = new ArrayList<>();

        for (PromotionProductRequest item : newProducts) {

            PromotionProduct pp = new PromotionProduct();

            pp.setPromotion(promotion);
            pp.setProduct(productService.findById(item.getProductId()));
            pp.setDiscountValue(item.getLocalDiscount());
            pp.setMaxQuantity(item.getLocalQty());
            pp.setSoldQuantity(0);

            entities.add(pp);
        }

        promotionProductRepository.saveAll(entities);
    }

    @Override
    public List<PromotionProductMappingResponse> promotionMappingResponses(List<Integer> productIds) {

        List<PromotionProduct> promotionProducts = findActivePromotions(productIds);

        Map<Integer, List<PromotionProductMappingResponse.PromotionProductDetailResponse>> grouped = new HashMap<>();

        for (PromotionProduct pp : promotionProducts) {
            grouped.computeIfAbsent(
                    pp.getProduct().getId(),
                    key -> new ArrayList<>()).add(
                            new PromotionProductMappingResponse.PromotionProductDetailResponse(
                                    pp.getId(),
                                    pp.getPromotion().getId(),
                                    pp.getPromotion().getName(),
                                    pp.getPromotion().getPromotionCampaignType(),
                                    pp.getMaxQuantity(),
                                    pp.getDiscountValue(),
                                    pp.getPromotion().getStartDate(),
                                    pp.getPromotion().getExpireDate()));
        }

        return productIds.stream()
                .map(productId -> new PromotionProductMappingResponse(
                        productId,
                        grouped.getOrDefault(productId, List.of())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionProduct> findActivePromotions(List<Integer> productIds) {

        if (productIds == null || productIds.isEmpty()) {
            return Collections.emptyList();
        }

        return promotionProductRepository.findActivePromotionProducts(productIds);
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getCurrentDiscountPercent(Integer productId) {

        PromotionProduct promotionProduct = promotionProductRepository
                .findActivePromotionByProductId(productId)
                .orElse(null);

        if (promotionProduct == null) {
            return 0;
        }

        int sold = Optional.ofNullable(promotionProduct.getSoldQuantity()).orElse(0);
        int reserved = Optional.ofNullable(promotionProduct.getReservedQuantity()).orElse(0);

        if (sold + reserved >= promotionProduct.getMaxQuantity()) {
            return 0;
        }

        return promotionProduct.getDiscountValue();
    }

    @Override
    @Transactional
    public void reservePromotions(List<CartItem> cartItems) {

        List<Integer> productIds = cartItems.stream()
                .map(item -> item.getProduct().getId())
                .toList();

        List<PromotionProduct> promotionProducts = promotionProductRepository.findAvailablePromotions(productIds);

        Map<Integer, PromotionProduct> promotionMap = promotionProducts.stream()
                .collect(Collectors.toMap(
                        pp -> pp.getProduct().getId(),
                        Function.identity()));

        List<PromotionProduct> updates = new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            PromotionProduct promotionProduct = promotionMap.get(cartItem.getProduct().getId());

            if (promotionProduct == null) {
                // Không có hoặc đã hết khuyến mãi
                continue;
            }

            int quantity = cartItem.getQuantity();

            int sold = Optional.ofNullable(promotionProduct.getSoldQuantity()).orElse(0);
            int reserved = Optional.ofNullable(promotionProduct.getReservedQuantity()).orElse(0);

            int available = promotionProduct.getMaxQuantity() - sold - reserved;

            if (available < quantity) {
                // Không đủ suất -> giữ giá gốc, không reserve
                continue;
            }

            promotionProduct.setReservedQuantity(reserved + quantity);
            updates.add(promotionProduct);
        }

        if (!updates.isEmpty()) {
            promotionProductRepository.saveAll(updates);
        }
    }

    @Override
    @Transactional
    public void confirmPromotions(List<OrderItem> orderItems) {

        List<Integer> productIds = orderItems.stream()
                .map(item -> item.getProduct().getId())
                .distinct()
                .toList();

        List<PromotionProduct> promotionProducts = promotionProductRepository.findActivePromotionProducts(productIds);

        Map<Integer, PromotionProduct> promotionMap = promotionProducts.stream()
                .collect(Collectors.toMap(
                        pp -> pp.getProduct().getId(),
                        Function.identity()));

        List<PromotionProduct> updates = new ArrayList<>();

        for (OrderItem orderItem : orderItems) {

            boolean isPromotion = orderItem.getOriginalPrice() != null
                    && orderItem.getPrice() != null
                    && orderItem.getOriginalPrice() > orderItem.getPrice();

            if (!isPromotion) {
                continue;
            }

            PromotionProduct promotionProduct = promotionMap.get(orderItem.getProduct().getId());

            if (promotionProduct == null) {
                continue;
            }

            int quantity = orderItem.getQuantity();

            int reserved = Optional.ofNullable(
                    promotionProduct.getReservedQuantity()).orElse(0);

            int sold = Optional.ofNullable(
                    promotionProduct.getSoldQuantity()).orElse(0);

            promotionProduct.setReservedQuantity(
                    Math.max(0, reserved - quantity));

            promotionProduct.setSoldQuantity(
                    sold + quantity);

            updates.add(promotionProduct);
        }

        if (!updates.isEmpty()) {
            promotionProductRepository.saveAll(updates);
        }
    }

    @Override
    @Transactional
    public void releasePromotions(List<OrderItem> orderItems) {

        List<Integer> productIds = orderItems.stream()
                .map(item -> item.getProduct().getId())
                .distinct()
                .toList();

        List<PromotionProduct> promotionProducts = promotionProductRepository.findActivePromotionProducts(productIds);

        Map<Integer, PromotionProduct> promotionMap = promotionProducts.stream()
                .collect(Collectors.toMap(
                        pp -> pp.getProduct().getId(),
                        Function.identity()));

        List<PromotionProduct> updates = new ArrayList<>();

        for (OrderItem orderItem : orderItems) {

            // Chỉ release nếu OrderItem đã mua với giá khuyến mãi
            boolean isPromotion = orderItem.getOriginalPrice() != null
                    && orderItem.getPrice() != null
                    && orderItem.getOriginalPrice() > orderItem.getPrice();

            if (!isPromotion) {
                continue;
            }

            PromotionProduct promotionProduct = promotionMap.get(orderItem.getProduct().getId());

            if (promotionProduct == null) {
                continue;
            }

            int reserved = Optional.ofNullable(
                    promotionProduct.getReservedQuantity()).orElse(0);

            promotionProduct.setReservedQuantity(
                    Math.max(0, reserved - orderItem.getQuantity()));

            updates.add(promotionProduct);
        }

        if (!updates.isEmpty()) {
            promotionProductRepository.saveAll(updates);
        }
    }
}
