package com.dev.backend.dto.image;

import org.springframework.web.multipart.MultipartFile;

public record ImageRequest(
        MultipartFile file,
        String url,
        boolean isThumbnail) {
}
