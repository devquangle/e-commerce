package com.dev.backend.dto.author;

public record AuthorWithProductCountResponse(
        Integer id,
        String name,
        String slug,
        String urlImage,
        String description,
        Long bookCount) {}
