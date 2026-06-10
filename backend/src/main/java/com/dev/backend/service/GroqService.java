package com.dev.backend.service;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.dto.grop.BookMetadataResponse;
import com.dev.backend.dto.grop.GroqRequest;
import com.dev.backend.dto.grop.Message;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroqService {
        private final RestTemplate restTemplate;
        private final ObjectMapper objectMapper;

        private static final String grop_key = "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";

        public BookMetadataResponse generateMetadata(
                        String title,
                        List<String> authors,
                        String description) {
                try {
                        String prompt = """
                                        Dựa trên thông tin sách sau:

                                        Tên sách: %s
                                        Tác giả: %s
                                        Mô tả: %s

                                        Hãy trả về JSON hợp lệ:

                                        {
                                          "summary": "",
                                          "highlights": [],
                                          "targetAudience": [],
                                          "notableWorks": []
                                        }

                                        Chỉ trả về JSON.
                                        """
                                        .formatted(title,  String.join(", ", authors), description);

                        GroqRequest request = new GroqRequest(
                                        "openai/gpt-oss-20b",
                                        List.of(
                                                        new Message("user", prompt)));

                        HttpHeaders headers = new HttpHeaders();
                        headers.setBearerAuth(grop_key);
                        headers.setContentType(MediaType.APPLICATION_JSON);

                        HttpEntity<GroqRequest> entity = new HttpEntity<>(request, headers);

                        ResponseEntity<String> response = restTemplate.postForEntity(
                                        "https://api.groq.com/openai/v1/chat/completions",
                                        entity,
                                        String.class);

                        JsonNode root = objectMapper.readTree(response.getBody());

                        String content = root
                                        .path("choices")
                                        .get(0)
                                        .path("message")
                                        .path("content")
                                        .asText();

                        return objectMapper.readValue(
                                        content,
                                        BookMetadataResponse.class);
                } catch (Exception e) {
                        e.printStackTrace();
                        return null;
                }

        }
}
