package com.dev.backend.service.impl;

import com.dev.backend.service.CloudinaryService;
import com.dev.backend.service.GeminiService;
import com.google.genai.Client;
import com.google.genai.types.Blob;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import lombok.RequiredArgsConstructor;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiServiceImpl.class);

    private final Client client;
    private final CloudinaryService cloudinaryService;

    // FIX: use stable image model
    private static final String MODEL_ID = "gemini-3-flash-preview";

    @Override
    public String generateImage(String genreName) {
        try {
            logger.info("Generating image for genre: {}", genreName);

            String prompt = "Cinematic book cover illustration for '" + genreName + "', " +
                    "ultra detailed, professional digital art, dramatic lighting, 8k, no text, no watermark.";

            byte[] imageBytes = generateImageDirectly(prompt);

            if (imageBytes == null || imageBytes.length < 100) {
                logger.error("Invalid image response from Gemini");
                return fallbackImage();
            }

            logger.info("Image generated successfully: {} bytes", imageBytes.length);
            return cloudinaryService.uploadImage(imageBytes);

        } catch (Exception e) {
            logger.error("Gemini image generation failed", e);
            return fallbackImage();
        }
    }

    private byte[] generateImageDirectly(String prompt) {
        try {
            GenerateContentConfig config = GenerateContentConfig.builder()
                    .responseModalities("IMAGE")
                    .build();

            GenerateContentResponse response = client.models.generateContent(MODEL_ID, prompt, config);

            return extractImageBytes(response);

        } catch (Exception e) {
            logger.error("Gemini API error", e);
            return null;
        }
    }

    private byte[] extractImageBytes(GenerateContentResponse response) {

        if (response == null ||
                response.candidates() == null ||
                response.candidates().isEmpty()) {
            return null;
        }

        var candidate = response.candidates().get().get(0);

        if (candidate.content().isEmpty()) {
            return null;
        }

        var content = candidate.content().get();

        if (content.parts().isEmpty()) {
            return null;
        }

        for (Part part : content.parts().get()) {

            var blobOpt = part.inlineData();

            if (blobOpt.isEmpty()) {
                continue;
            }

            Blob blob = blobOpt.get();

            byte[] data = blob.data().orElse(null);

            if (data != null && data.length > 0) {
                return data;
            }
        }

        return null;
    }

    private String fallbackImage() {
        return "https://via.placeholder.com/1024x1024.png?text=Image+Generation+Failed";
    }

    @Override
    public String toEnglishPrompt(String viInput) {

        String prompt = """
                You are a professional AI prompt engineer for BOOK GENRE illustrations.

                Convert the input genre into ONE short professional AI image prompt.

                RULES:
                - English only
                - Output ONLY the final prompt
                - Maximum 25 words
                - Use comma-separated keywords
                - No storytelling
                - Focus on visual representation of a BOOK GENRE

                VISUAL REQUIREMENTS:
                - symbolic objects related to the genre
                - cinematic atmosphere
                - suitable as a genre thumbnail or category image
                - centered composition
                - visually clear and iconic

                STYLE:
                cinematic lighting, ultra detailed, concept art, digital painting, 4k

                IMPORTANT:
                IF THE GENRE IS NOT IN THE EXAMPLES:
                - infer the visual symbolism from the genre meaning
                - create iconic objects and atmosphere related to the genre
                - keep the output visually clear and suitable as a genre thumbnail

                EXAMPLES:

                Horror:
                dark haunted library, ghost shadows, fog, eerie atmosphere, cinematic lighting, horror concept art, 4k

                Romance:
                romantic books, roses, warm sunset glow, dreamy atmosphere, soft lighting, romance concept art, 4k

                Fantasy:
                magical library, floating spell books, glowing runes, fantasy atmosphere, cinematic lighting, 4k

                Anime:
                anime manga books, japanese art style, vibrant colors, cinematic lighting, anime illustration, 4k

                Detective:
                mystery books, magnifying glass, dark desk, noir atmosphere, cinematic lighting, detective concept art, 4k

                INPUT:
                %s
                """
                .formatted(viInput);

        GenerateContentResponse response = client.models.generateContent(
                MODEL_ID,
                prompt,
                null);
        String result = response.text()
                .replace("\n", "")
                .replace("\"", "")
                .trim();
        result += ", centered composition, clean background";

        // chống prompt quá dài cho Pollinations
        if (result.length() > 300) {
            result = result.substring(0, 300);
        }

        return result;
    }

    @Override
    public String generateImageUrl(String viInput) {

        // 1. Vietnamese -> English optimized prompt
        String englishPrompt = toEnglishPrompt(viInput);

        // 2. Encode URL
        String encodedPrompt = URLEncoder.encode(
                englishPrompt,
                StandardCharsets.UTF_8);

        // 3. Pollinations URL
        return "https://image.pollinations.ai/prompt/" + encodedPrompt;
    }
}