package com.dev.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.promotion.PromotionProductMappingResponse;
import com.dev.backend.dto.promotion.PromotionDetailResponse;
import com.dev.backend.dto.promotion.PromotionFilter;
import com.dev.backend.dto.promotion.PromotionRequest;
import com.dev.backend.dto.promotion.PromotionResponse;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.PromotionProductService;
import com.dev.backend.service.PromotionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PromotionController {
    private final PromotionService promotionService;
    private final PromotionProductService promotionProductService;

    @GetMapping("/admin/promotions/search")
    public ResponseEntity<ResponseData<PageResponse<PromotionResponse>>> search(
            @ModelAttribute PromotionFilter request) {
        PageResponse<PromotionResponse> response = promotionService.search(request);
        return ResponseUtil.success("Lọc sản phẩm thành công", response);
    }

    @PostMapping("/admin/promotions")
    public ResponseEntity<ResponseData<PromotionResponse>> add(@Valid @RequestBody PromotionRequest promotionRequest) {
        PromotionResponse response = promotionService.addPromotion(promotionRequest);
        return ResponseUtil.success("Thêm chương trình khuyến mãi thành công.", response);
    }

    @GetMapping("/admin/promotions/{id}")
    public ResponseEntity<ResponseData<PromotionDetailResponse>> edit(@PathVariable Integer id) {
        PromotionDetailResponse response = promotionService.edit(id);
        return ResponseUtil.success("Lấy thông tin chương trình khuyến mãi thành công.", response);
    }

    @PutMapping("/admin/promotions/{id}")
    public ResponseEntity<ResponseData<PromotionResponse>> update(@PathVariable Integer id,
            @Valid @RequestBody PromotionRequest promotionRequest) {
        PromotionResponse response = promotionService.updatePromotion(id, promotionRequest);
        return ResponseUtil.success("Cập nhật chương trình khuyến mãi thành công.", response);
    }

    @DeleteMapping("/admin/promotions/{id}")
    public ResponseEntity<ResponseData<Void>> delete(@PathVariable Integer id) {
        promotionService.delete(id);
        return ResponseUtil.success("Xoá chương trình khuyến mãi thành công.", null);
    }

    @GetMapping("/admin/promotions/by-products")
    public ResponseEntity<ResponseData<List<PromotionProductMappingResponse>>> promotionProduct(
            @RequestParam List<Integer> productIds) {
        List<PromotionProductMappingResponse> promotionMappingResponses= promotionProductService.promotionMappingResponses(productIds);
        return ResponseUtil.success("Xoá chương trình khuyến mãi thành công.", promotionMappingResponses);
    }

}
