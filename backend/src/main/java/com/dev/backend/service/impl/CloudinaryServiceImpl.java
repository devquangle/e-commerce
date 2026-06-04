package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dev.backend.dto.image.ImageRequest;
import com.dev.backend.dto.image.ImageResponse;
import com.dev.backend.service.CloudinaryService;

import jakarta.annotation.PostConstruct;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File upload không được để trống");
            }
            return (String) cloudinary.uploader()
                    .upload(file.getBytes(), ObjectUtils.emptyMap())
                    .get("secure_url");
        } catch (Exception e) {
            // Log lỗi ra console để dev dễ theo dõi bẫy lỗi
            System.err.println("Lỗi khi upload MultipartFile lên Cloudinary: " + e.getMessage());
            // Ném ra RuntimeException để Spring Boot có thể handle hoặc rollback
            // transaction nếu cần
            throw new RuntimeException("Upload ảnh thất bại: " + e.getMessage(), e);
        }
    }

    @Override
    public String uploadImage(byte[] imageBytes) {
        try {
            if (imageBytes == null || imageBytes.length == 0) {
                throw new IllegalArgumentException("Dữ liệu byte ảnh không được để trống");
            }
            return cloudinary.uploader()
                    .upload(imageBytes, ObjectUtils.emptyMap())
                    .get("secure_url")
                    .toString();
        } catch (Exception e) {
            System.err.println("Lỗi khi upload byte[] lên Cloudinary: " + e.getMessage());
            throw new RuntimeException("Upload ảnh từ byte array thất bại: " + e.getMessage(), e);
        }
    }

    @Override
    public String uploadImageUrl(String imageUrl) {
        try {
            if (imageUrl == null || imageUrl.strip().isEmpty()) {
                throw new IllegalArgumentException("Đường dẫn URL không được để trống");
            }
            return (String) cloudinary.uploader()
                    .upload(imageUrl.strip(), ObjectUtils.emptyMap())
                    .get("secure_url");
        } catch (Exception e) {
            System.err.println("Lỗi khi upload từ URL: " + e.getMessage());
            throw new RuntimeException("Upload ảnh từ URL thất bại: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ImageResponse> imageResponses(List<ImageRequest> imageRequests) {
        List<ImageResponse> responses = new ArrayList<>();
        
        if (imageRequests == null || imageRequests.isEmpty()) {
            return responses;
        }

        for (ImageRequest req : imageRequests) {
            String finalUrl = req.url(); 
            if (req.file() != null && !req.file().isEmpty()) {
                finalUrl = this.uploadImage(req.file());
            } 
            else if (finalUrl != null && !finalUrl.strip().isEmpty()) {
                String trimmedUrl = finalUrl.strip();
                
                if (!trimmedUrl.contains("res.cloudinary.com/" + cloudName)) {
                    finalUrl = this.uploadImageUrl(trimmedUrl);
                }
            }

            responses.add(new ImageResponse(finalUrl, req.isThumbnail()));
        }

        return responses;
    }
}