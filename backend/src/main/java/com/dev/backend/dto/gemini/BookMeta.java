package com.dev.backend.dto.gemini;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookMeta {
    // Nội dung chính (H2)
    private String mainSummary; // Đoạn văn 15 - 25 câu

    // Điểm nổi bật (H2 + Bullet list)
    private List<String> highlights;

    // Gía trị nghệ thuật
    private List<String> artisticValue;

    // Đối tượng độc giả (H2 + Bullet list)
    private List<String> targetAudience;

    private List<AuthorsBookMeta> authorsBookMetas;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AuthorsBookMeta {
        private String name;
        private String bio;
    }

}
