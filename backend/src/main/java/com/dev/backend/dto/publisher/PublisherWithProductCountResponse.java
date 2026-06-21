package com.dev.backend.dto.publisher;

public record PublisherWithProductCountResponse(
        Integer id,
        String name,
        String slug,
        Long bookCount
) {}
