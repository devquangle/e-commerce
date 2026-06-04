package com.dev.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.image.ImageRequest;
import com.dev.backend.dto.image.ImageResponse;
import com.dev.backend.dto.image.ImageUploadForm;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class UploadImageController {
    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload-image")
    public ResponseEntity<ResponseData<List<ImageResponse>>> uploadImage(
            @ModelAttribute ImageUploadForm form) {
        List<ImageResponse> imageResponses = cloudinaryService.imageResponses(form.imageRequests());
        return ResponseUtil.success("Tải ảnh thành công", imageResponses);
    }
}
