package com.dev.backend.service;

public interface GeminiService {
    String generateImage(String genreName);

    String toEnglishPrompt(String viInput);

    String generateImageUrl(String viInput);
}
