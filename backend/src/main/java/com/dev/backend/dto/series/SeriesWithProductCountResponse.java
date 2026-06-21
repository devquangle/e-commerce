package com.dev.backend.dto.series;

public record SeriesWithProductCountResponse(        
        Integer id,
        String name,
        String slug,
        Long bookCount) {
} 