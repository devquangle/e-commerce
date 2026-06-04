package com.dev.backend.service.impl;

import org.springframework.stereotype.Service;

import com.dev.backend.dto.image.ImageResponse;
import com.dev.backend.entity.Image;
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
    public ImageResponse save(Image image) {

        return imageMapper.toDTO(imageRepository.save(image));
    }

    @Override
    public void delete(Integer id) {

    }
}
