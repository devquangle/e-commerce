package com.dev.backend.dto.genre;


public record GenreWithProductCountResponse(
        Integer id,
        String name,
        String slug,
        String urlImage,
        Long bookCount) {
}
