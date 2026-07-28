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
import com.dev.backend.entity.Product;
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

        List<PromotionProduct> promotionProducts = promotionProductRepository.findPromotionByProductIds(productIds);

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
    public Integer getDiscountValueByProductId(Integer productId) {
        Integer discountValue = promotionProductRepository.findDiscountValueByProductId(productId);
        log.info("ProductId = {}", productId);
        log.info("discountValue: {}", discountValue);
        return Optional.ofNullable(discountValue).orElse(0);
    }

    @Override
    public Integer calculateSalePrice(Product product) {

        int originalPrice = product.getPrice();

        int discountPercent = getDiscountValueByProductId(product.getId());

        return originalPrice - originalPrice * discountPercent / 100;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionProduct> findActivePromotions(List<Integer> productIds) {

        if (productIds == null || productIds.isEmpty()) {
            return Collections.emptyList();
        }

        return promotionProductRepository.findActivePromotions(productIds);
    }

    @Override
@Transactional
public void reservePromotions(List<CartItem> cartItems) {

    List<Integer> productIds = cartItems.stream()
            .map(item -> item.getProduct().getId())
            .toList();


    List<PromotionProduct> promotionProducts =
            promotionProductRepository.findActivePromotions(productIds);


    Map<Integer, PromotionProduct> promotionMap =
            promotionProducts.stream()
                    .collect(Collectors.toMap(
                            pp -> pp.getProduct().getId(),
                            Function.identity()
                    ));


    List<PromotionProduct> updates = new ArrayList<>();


    for (CartItem cartItem : cartItems) {

        PromotionProduct promotionProduct =
                promotionMap.get(
                    cartItem.getProduct().getId()
                );


        // Không có promotion
        if (promotionProduct == null) {
            continue;
        }


        int quantity = cartItem.getQuantity();


        int soldQuantity = 
                promotionProduct.getSoldQuantity() == null
                ? 0
                : promotionProduct.getSoldQuantity();


        int reservedQuantity =
                promotionProduct.getReservedQuantity() == null
                ? 0
                : promotionProduct.getReservedQuantity();


        int available =
                promotionProduct.getMaxQuantity()
                - soldQuantity
                - reservedQuantity;


        if (available < quantity) {
            throw new RuntimeException(
                    "Số lượng khuyến mãi không đủ"
            );
        }


        promotionProduct.setReservedQuantity(
                reservedQuantity + quantity
        );


        updates.add(promotionProduct);
    }


    if (!updates.isEmpty()) {
        promotionProductRepository.saveAll(updates);
    }
}
}
