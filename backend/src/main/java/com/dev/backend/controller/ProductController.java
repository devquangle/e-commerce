package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/products/filter")
    public ResponseEntity<ResponseData<PageResponse<ProductResponse>>> filter(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        PageResponse<ProductResponse> response = productService.pages(page - 1, size, keyword, status);
        return ResponseUtil.success("Lấy danh sách sản phẩm thành công", response);
    }

    @PostMapping("products")
    public ResponseEntity<ResponseData<ProductResponse>> post_product(@RequestBody ProductRequest request) {
        ProductResponse response = productService.add(request);
        return ResponseUtil.success("Thêm sản phẩm thành công", response);
    }

    @GetMapping("products/{id}")
    public ResponseEntity<ResponseData<ProductResponse>> edit(@PathVariable Integer id) {
        ProductResponse response = productService.edit(id);
        return ResponseUtil.success("lấy thông tin phẩm thành công", response);
    }
}
