package com.dev.backend.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.dto.image.ImageRequest;
import com.dev.backend.dto.image.ImageResponse;

public interface CloudinaryService {

        String uploadImage(MultipartFile file);

        String uploadImage(byte[] imageBytes);

        String uploadImageUrl(String imageUrl);

        List<ImageResponse> imageResponses(List<ImageRequest> imageRequests);

}
