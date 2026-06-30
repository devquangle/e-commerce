package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

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
    public void savePromotionProducts(
            Promotion promotion,
            List<PromotionProductRequest> requests) {

        List<PromotionProduct> entities = new ArrayList<>();

        for (PromotionProductRequest item : requests) {

            PromotionProduct pp = new PromotionProduct();

            pp.setPromotion(promotion);
            pp.setProduct(productService.findById(item.getId()));
            pp.setDiscountValue(item.getLocalDiscount());
            pp.setMaxQuantity(item.getLocalQty());
            pp.setSoldQuantity(0);

            entities.add(pp);
        }

        promotionProductRepository.saveAll(entities);
    }
}
