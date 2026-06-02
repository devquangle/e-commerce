package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.entity.Product;
import com.dev.backend.mapper.ProductMapper;
import com.dev.backend.repository.ProductRepository;
import com.dev.backend.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
@Service
@Log4j2
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;



    @Override
    public List<ProductResponse> findAll() {
      
        return productRepository.findAll().stream().map(productMapper::toDTO).toList();
        
    }

    @Override
    public ProductResponse add(ProductRequest productRequest) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void delete(Integer id) {
        // TODO Auto-generated method stub

    }

    @Override
    public Product findById(Integer id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Product findByName(String name) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Product save(Product product) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public ProductResponse update(Integer id, ProductRequest productRequest) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void validate(ProductRequest productRequest) {
        // TODO Auto-generated method stub

    }

}
