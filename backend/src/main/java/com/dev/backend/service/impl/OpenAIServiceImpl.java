package com.dev.backend.service.impl;

import java.util.Base64;
import org.springframework.stereotype.Service;

import com.dev.backend.service.CloudinaryService;
import com.dev.backend.service.OpenAIService;
import com.openai.client.OpenAIClient;

import com.openai.models.images.ImageGenerateParams;
import com.openai.models.images.ImagesResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OpenAIServiceImpl implements OpenAIService {
        private final OpenAIClient openAIClient;

        private final CloudinaryService cloudinaryService;

        private String buildPrompt(String genreName) {

                return switch (genreName.toLowerCase()) {

                        case "kinh dị" ->
                                """
                                                Dark horror illustration,
                                                creepy atmosphere,
                                                cinematic lighting,
                                                dark forest,
                                                high quality digital art,
                                                no text
                                                """;

                        case "shounen" ->
                                """
                                                Anime shounen manga style,
                                                action energy,
                                                dynamic pose,
                                                japanese manga art,
                                                colorful,
                                                high quality,
                                                no text
                                                """;

                        case "trinh thám" ->
                                """
                                                Detective mystery illustration,
                                                noir style,
                                                dark city,
                                                investigation mood,
                                                cinematic,
                                                high quality,
                                                no text
                                                """;

                        case "fantasy" ->
                                """
                                                Fantasy magic world,
                                                mystical atmosphere,
                                                epic landscape,
                                                fantasy illustration,
                                                high quality,
                                                no text
                                                """;

                        default ->
                                genreName +
                                                """
                                                                book genre illustration,
                                                                modern digital art,
                                                                high quality,
                                                                no text
                                                                """;
                };
        }

        @Override
        public String generateImage(String genreName) {

                try {
                        String prompt = buildPrompt(genreName);

                        ImageGenerateParams params = ImageGenerateParams.builder()
                                        .model("gpt-image-1")
                                        .prompt(prompt)
                                        .size(ImageGenerateParams.Size._512X512)
                                        .build();

                        ImagesResponse response = openAIClient.images().generate(params);

                        String base64 = response.data()
                                        .get(0)
                                        .b64Json()
                                        .orElse("");

                        byte[] imageBytes = Base64.getDecoder()
                                        .decode(base64);

                        return cloudinaryService
                                        .uploadImage(imageBytes);
                } catch (Exception e) {
                        e.printStackTrace();

                        throw new RuntimeException(
                                        "Generate image failed",
                                        e);
                }
        }
}
