package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.productdetail.ProductInfo;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProductDetailController {
    private final ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<ResponseData<ProductInfo>> getProductDetail(@RequestParam("slug") String slug) {
        ProductInfo item = productService.productInfo(slug);
        return ResponseUtil.success("Lấy sản phẩm thành công", item);
    }

}
