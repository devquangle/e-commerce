package com.dev.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.GeminiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class ImageController {
    private final GeminiService geminiService;

    @GetMapping("/generate")
    public ResponseEntity<ResponseData<Map<String, String>>> generate(@RequestParam String input) {
        String imageUrl = geminiService.generateImageUrl(input);
        Map<String, String> data = Map.of("imageUrl", imageUrl);
        return ResponseUtil.success("Tạo ảnh thành công", data);
    }

}
