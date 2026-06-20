package com.dev.backend.repository;

import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepositoryCustom {
    Page<ProductCardResponse> filterProducts(ProductFilterRequest request, Pageable pageable);
}
