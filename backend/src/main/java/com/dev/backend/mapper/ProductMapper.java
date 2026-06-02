package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.entity.Product;

@Component
public class ProductMapper {
    
    public ProductResponse toDTO(Product product){
        if (product==null) {
            return null;
        }
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setPrice(product.getPrice());
        return dto;
    }
}
