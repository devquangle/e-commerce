package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.gemini.BookMeta;

public interface GeminiService {
    String generateImage(String genreName);

    String toEnglishPrompt(String viInput);

    String generateImageUrl(String viInput);

    BookMeta generateBookMeta(String name, List<String> authors);

}
