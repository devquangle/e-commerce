package com.dev.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.dto.grop.BookMetadataResponse;
import com.dev.backend.dto.grop.GroqRequest;
import com.dev.backend.dto.grop.Message;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroqService {

        private final RestTemplate restTemplate;
        private final ObjectMapper objectMapper;
        @Value("${app.groq.api-key}")
        private String groqApiKey;
        private static final String PROMPT_TEMPLATE = """
                        Bạn là chuyên gia metadata sách.

                        INPUT

                        Title: _TITLE_

                        Description: _DESC_

                        NHIỆM VỤ

                        1. Tạo summary ngắn gọn và chính xác về cuốn sách.
                        2. Trích xuất 3-8 highlights quan trọng.
                        3. Xác định nhóm độc giả phù hợp.

                        QUY TẮC

                        - Summary tối đa 300 từ.
                        - Highlights phải ngắn gọn.
                        - TargetAudience là các nhóm độc giả.
                        - Không giải thích.
                        - Không markdown.
                        - Chỉ trả về JSON hợp lệ.

                        OUTPUT

                        {
                          "summary": "",
                          "highlights": [],
                          "targetAudience": []
                        }
                        """;

        public BookMetadataResponse generateMetadata(
                        String title,
                        String description) {

                try {

                        String prompt = PROMPT_TEMPLATE
                                        .replace("_TITLE_", safe(title))
                                        .replace("_DESC_", safe(description));

                        GroqRequest request = new GroqRequest(
                                        "openai/gpt-oss-120b",
                                        List.of(new Message(
                                                        "system",
                                                        "Bạn là chuyên gia metadata sách. Chỉ trả về JSON hợp lệ. Không markdown. Không giải thích."),
                                                        new Message("user", prompt)));

                        HttpHeaders headers = new HttpHeaders();
                        headers.setBearerAuth(groqApiKey);
                        headers.setContentType(MediaType.APPLICATION_JSON);

                        HttpEntity<GroqRequest> entity = new HttpEntity<>(request, headers);

                        ResponseEntity<String> response = restTemplate.postForEntity(
                                        "https://api.groq.com/openai/v1/chat/completions",
                                        entity,
                                        String.class);

                        JsonNode root = objectMapper.readTree(response.getBody());

                        JsonNode contentNode = root.at("/choices/0/message/content");

                        if (contentNode.isMissingNode() || contentNode.isNull()) {
                                throw new RuntimeException("Invalid Groq response structure");
                        }

                        String content = contentNode.asText();

                        log.debug("Groq raw response length={}", content.length());

                        String cleaned = extractJson(content);

                        JsonNode jsonNode = objectMapper.readTree(cleaned);

                        return objectMapper.treeToValue(jsonNode, BookMetadataResponse.class);

                } catch (Exception e) {

                        log.error("Groq metadata generation failed", e);

                        return new BookMetadataResponse(
                                        "",
                                        List.of(),
                                        List.of());
                }
        }

        /**
         * Extract JSON safely from LLM response
         */
        private String extractJson(String content) {

                if (content == null)
                        return "{}";

                String cleaned = content
                                .replaceAll("(?s)```json", "")
                                .replaceAll("(?s)```", "")
                                .trim();

                int start = cleaned.indexOf("{");
                int end = cleaned.lastIndexOf("}");

                if (start >= 0 && end > start) {
                        return cleaned.substring(start, end + 1);
                }

                return "{}";
        }

        /**
         * Prevent null injection into prompt
         */
        private String safe(String input) {
                return input == null ? "" : input;
        }
}