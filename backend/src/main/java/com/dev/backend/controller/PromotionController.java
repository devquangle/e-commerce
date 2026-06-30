package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
import com.dev.backend.dto.promotion.PromotionFilter;
import com.dev.backend.dto.promotion.PromotionResponse;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.PromotionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PromotionController {
    private final PromotionService promotionService;

    @GetMapping("/admin/promotions/search")
    public ResponseEntity<ResponseData<PageResponse<PromotionResponse>>> searchProducts(
            @ModelAttribute PromotionFilter request) {
        PageResponse<PromotionResponse> response = promotionService.search(request);
        return ResponseUtil.success("Lọc sản phẩm thành công", response);
    }

}
