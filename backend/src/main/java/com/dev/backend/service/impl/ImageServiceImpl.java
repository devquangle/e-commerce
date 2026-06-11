package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.dto.image.ImageResponse;
import com.dev.backend.entity.Image;
import com.dev.backend.entity.Product;
import com.dev.backend.mapper.ImageMapper;
import com.dev.backend.repository.ImageRepository;
import com.dev.backend.service.ImageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

    @Override
    public void delete(Integer id) {
        // TODO Auto-generated method stub

    }

    @Override
    public Image save(Image image) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    @Transactional // 1. Đảm bảo tính toàn vẹn: Tất cả cùng lưu hoặc cùng fail (nếu lỗi)
    public void saveProductImages(Product product, List<ImageResponse> imageResponses) {
        if (imageResponses == null || imageResponses.isEmpty()) {
            return;
        }

        List<Image> imagesToSave = new ArrayList<>();

        for (ImageResponse item : imageResponses) {
            Image image = new Image();
            image.setUrlImage(item.url());
            image.setThumbnail(item.isThumbnail());
            image.setProduct(product); 
            imagesToSave.add(image);
        }

        imageRepository.saveAll(imagesToSave);
    }
}
