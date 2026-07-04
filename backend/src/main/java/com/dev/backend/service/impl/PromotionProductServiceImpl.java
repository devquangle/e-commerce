package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.dto.promotion.PromotionProductMappingResponse;
import com.dev.backend.dto.promotion.PromotionProductRequest;
import com.dev.backend.entity.Promotion;
import com.dev.backend.entity.PromotionProduct;
import com.dev.backend.repository.PromotionProductRepository;
import com.dev.backend.service.ProductService;
import com.dev.backend.service.PromotionProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
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
    public Integer findDiscountValueByProductId(Integer productId) {
        Integer discountValue =promotionProductRepository.findDiscountValueByProductId(productId);
        return Optional.ofNullable(discountValue).orElse(0);
    }
}
