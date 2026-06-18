package com.dev.backend.dto.genre;

public record UserGenreResponse(
        Integer id,
        String name,
        String slug,
        String urlImage,
        Long  bookCount) {}