package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.image.ImageResponse;
import com.dev.backend.entity.Image;
import com.dev.backend.entity.Product;

public interface ImageService {
    Image save(Image image);

    void saveProductImages(Product product, List<ImageResponse> imageResponses);

    void delete(Integer id);
}
