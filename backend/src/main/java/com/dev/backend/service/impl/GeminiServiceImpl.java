package com.dev.backend.service.impl;

import com.dev.backend.dto.gemini.BookMeta;
import com.dev.backend.service.CloudinaryService;
import com.dev.backend.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;

import java.io.InputStream;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiServiceImpl.class);

    private final Client client;
    private final CloudinaryService cloudinaryService;
    private static final String MODEL_ID = "gemini-3.1-flash-lite";

    @Override
    public String generateImage(String genreName) {
        try {
            logger.info("Generating image via Pollinations for genre: {}", genreName);

            // 1. Lấy URL ảnh từ Pollinations (Đã được Gemini dịch và tối ưu prompt)
            String imageUrl = generateImageUrl(genreName);
            logger.info("Target Pollinations URL: {}", imageUrl);

            byte[] imageBytes;
            try (InputStream in = URI.create(imageUrl).toURL().openStream()) {
                imageBytes = in.readAllBytes();
            }

            // Kiểm tra xem dữ liệu tải về có hợp lệ không
            if (imageBytes == null || imageBytes.length < 100) {
                logger.error("Invalid image bytes downloaded from Pollinations");
                return fallbackImage();
            }

            logger.info("Image downloaded successfully: {} bytes. Uploading to Cloudinary...", imageBytes.length);

            // 3. Upload mảng bytes này lên Cloudinary của bạn
            return cloudinaryService.uploadImage(imageBytes);

        } catch (Exception e) {
            logger.error("Gemini + Pollinations image generation flow failed", e);
            return fallbackImage();
        }
    }

    @Override
    public String toEnglishPrompt(String viInput) {
        String prompt = """
                You are a professional AI prompt engineer.
                Convert the following book genre into a short, concise image generation prompt for a website thumbnail.

                RULES:
                - Output ONLY the final prompt keywords, separated by commas.
                - Do not include any introductory text, quotes, explanations, or markdown.
                - Language: English.
                - Max length: 20 words.
                - Style: cinematic lighting, ultra detailed, concept art, digital painting, 4k.

                EXAMPLES:
                Input: Kinh dị -> dark haunted library, ghost shadows, fog, eerie atmosphere, horror concept art
                Input: Lãng mạn -> romantic books, roses, warm sunset glow, dreamy atmosphere, romance concept art
                Input: Trinh thám -> mystery books, magnifying glass, dark desk, noir atmosphere, detective concept art

                Input: %s
                """.formatted(viInput);

        try {
            GenerateContentResponse response = client.models.generateContent(MODEL_ID, prompt, null);

            if (response == null || response.text() == null) {
                return "book, " + viInput + ", cinematic lighting, clean background";
            }

            String result = response.text()
                    .replaceAll("(?i)Prompt:", "")
                    .replace("\n", "")
                    .replace("\"", "")
                    .replace("`", "")
                    .replace("*", "")
                    .trim();

            if (result.endsWith(".")) {
                result = result.substring(0, result.length() - 1);
            }

            result += ", centered composition, clean background";

            if (result.length() > 300) {
                result = result.substring(0, 300);
            }
            return result;

        } catch (Exception e) {
            logger.error("Failed to generate prompt via Gemini, using fallback text", e);
            return viInput + " book genre, cinematic lighting, clean background";
        }
    }

    @Override
    public String generateImageUrl(String viInput) {

        String englishPrompt = toEnglishPrompt(viInput);

        String encodedPrompt = URLEncoder.encode(englishPrompt, StandardCharsets.UTF_8);

        return "https://image.pollinations.ai/prompt/" + encodedPrompt;
    }

    private String fallbackImage() {
        return "https://via.placeholder.com/1024x1024.png?text=Image+Generation+Failed";
    }

   @Override
public BookMeta generateBookMeta(String name, List<String> authors) {
    String authorString = String.join(", ", authors);
    
    // Yêu cầu trả về tiếng Việt và đúng định dạng
    String prompt = """
            Hãy phân tích cuốn sách tiêu đề "%s" của tác giả %s.
            Yêu cầu nội dung:
            1. mainSummary: Tóm tắt nội dung chính (10-15 câu).
            2. highlights: 3-5 điểm nổi bật (dạng danh sách).
            3. artisticValue: 3-5 giá trị nghệ thuật (dạng danh sách).
            4. targetAudience: 3 nhóm độc giả mục tiêu (dạng danh sách).
            5. authorsBookMetas: Tên tác giả và tiểu sử/chuyên môn (tối đa 10 câu) cho mỗi người.
            
            QUY ĐỊNH BẮT BUỘC:
            - Trả về JSON thuần túy, không kèm giải thích.
            - Phải sử dụng đúng tên các key: "mainSummary", "highlights", "artisticValue", "targetAudience", "authorsBookMetas".
            - Trong "authorsBookMetas", sử dụng key là "name" và "bio".
            - Nội dung phải bằng TIẾNG VIỆT.
            """.formatted(name, authorString);

    try {
        GenerateContentResponse response = client.models.generateContent(MODEL_ID, prompt, null);

        String jsonText = response.text()
                .replaceAll("(?s).*?(\\{.*\\}).*", "$1") // Cố gắng lấy phần JSON nếu có rác xung quanh
                .replaceAll("```json", "")
                .replaceAll("```", "")
                .trim();

        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(jsonText, BookMeta.class);

    } catch (Exception e) {
        logger.error("Lỗi khi tạo BookMeta cho sách {}: {}", name, e.getMessage());
        return null;
    }
}
}