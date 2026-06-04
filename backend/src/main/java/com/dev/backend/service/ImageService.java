package com.dev.backend.service;

import com.dev.backend.dto.image.ImageResponse;
import com.dev.backend.entity.Image;

public interface ImageService {
    ImageResponse save(Image image);

    void delete(Integer id);
}
