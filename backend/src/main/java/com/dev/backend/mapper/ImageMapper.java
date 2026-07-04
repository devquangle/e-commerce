package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.image.ImageResponse;
import com.dev.backend.dto.image.ProductImageResponse;
import com.dev.backend.entity.Image;

@Component
public class ImageMapper {
    public ImageResponse toDTO(Image image) {
        if (image == null) {
            return null;
        }
        return new ImageResponse(
                image.getUrlImage(),
                image.isThumbnail());

    }

    public ProductImageResponse toProductImages(Image image) {
        if (image == null) {
            return null;
        }

        ProductImageResponse dto = new ProductImageResponse();
        dto.setUrl(image.getUrlImage());
        dto.setIsThumbnail(image.isThumbnail());
        return dto;
    }
}
