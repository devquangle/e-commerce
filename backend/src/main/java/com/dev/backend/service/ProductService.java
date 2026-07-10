package com.dev.backend.service;

import java.util.List;
import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductCartItemResponse;
import com.dev.backend.dto.product.ProductDetailResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.dto.product.ProductSearchRequest;
import com.dev.backend.dto.productdetail.ProductInfo;
import com.dev.backend.entity.Product;
import com.dev.backend.response.PageResponse;

public interface ProductService {

    List<ProductResponse> findAll();

    Product findById(Integer id);

    Product findByName(String name);

    Product findBySlug(String slug);

    PageResponse<ProductResponse> search(ProductSearchRequest request);

    Product save(Product product);

    ProductResponse add(ProductRequest productRequest);

    ProductResponse update(Integer id, ProductRequest productRequest);

    ProductDetailResponse edit(Integer id);

    void delete(Integer id);

    void validate(ProductRequest productRequest);

    PageResponse<ProductCardResponse> filterProducts(ProductFilterRequest request);

    ProductInfo productInfo(String slug);

    ProductCartItemResponse productCartItemResponse(Integer productId);


    Product findWithDetailsById(Integer id);
}
