package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping("products")
    public ResponseEntity<ResponseData<ProductResponse>> post_product(@RequestBody ProductRequest request) {
        ProductResponse response = productService.add(request);
        return ResponseUtil.success("Thêm sản phẩm thành công", response);
    }
}
