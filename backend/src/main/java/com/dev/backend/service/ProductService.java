package com.dev.backend.service;

import java.util.List;


import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.entity.Product;
import com.dev.backend.response.PageResponse;

public interface ProductService {

    List<ProductResponse> findAll();

    Product findById(Integer id);

    Product findByName(String name);

    Product findBySlug(String slug);

    PageResponse<ProductResponse> pages(int page, int size, String keyword, String status);

    Product save(Product product);

    ProductResponse add(ProductRequest productRequest);

    ProductResponse update(Integer id, ProductRequest productRequest);

    ProductResponse edit(Integer id);

    void delete(Integer id);

    void validate(ProductRequest productRequest);

}
