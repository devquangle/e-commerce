package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.entity.Product;

public interface ProductService {

    List<ProductResponse> findAll();

    Product findById(Integer id);

    Product findByName(String name);


    Product save(Product product);

    ProductResponse add(ProductRequest productRequest);

    ProductResponse update(Integer id, ProductRequest productRequest);

    void delete(Integer id);

    void validate(ProductRequest productRequest);

}
