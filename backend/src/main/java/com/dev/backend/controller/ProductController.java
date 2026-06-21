package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/admin/products/filter")
    public ResponseEntity<ResponseData<PageResponse<ProductResponse>>> filter(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        PageResponse<ProductResponse> response = productService.pages(page - 1, size, keyword, status);
        return ResponseUtil.success("Lấy danh sách sản phẩm thành công", response);
    }

    @GetMapping("/products/search")
    public ResponseEntity<ResponseData<PageResponse<ProductCardResponse>>> searchProducts(
            @ModelAttribute ProductFilterRequest request) {
        PageResponse<ProductCardResponse> response = productService.filterProducts(request);
        return ResponseUtil.success("Lọc sản phẩm thành công", response);
    }

    @PostMapping("/admin/products")
    public ResponseEntity<ResponseData<ProductResponse>> add(@RequestBody ProductRequest request) {
        ProductResponse response = productService.add(request);
        return ResponseUtil.success("Thêm sản phẩm thành công", response);
    }

    @GetMapping("/admin/products/{id}")
    public ResponseEntity<ResponseData<ProductResponse>> edit(@PathVariable Integer id) {
        ProductResponse response = productService.edit(id);
        return ResponseUtil.success("lấy thông tin phẩm thành công", response);
    }

    @PutMapping("/admin/products/{id}")
    public ResponseEntity<ResponseData<ProductResponse>> update(@PathVariable Integer id,
            @RequestBody ProductRequest request) {
        ProductResponse response = productService.update(id, request);
        return ResponseUtil.success("Cập nhật sản phẩm thành công", response);
    }
}
