package com.dev.backend.dto.product;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ProductCartItemResponseConverter
        implements AttributeConverter<ProductCartItemResponse, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ProductCartItemResponse attribute) {
        if (attribute == null) return null;
        try {
            return mapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ProductCartItemResponse convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return mapper.readValue(dbData, ProductCartItemResponse.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}