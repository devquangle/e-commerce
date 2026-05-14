package com.dev.backend.service.impl;

import org.springframework.stereotype.Service;

import com.dev.backend.service.OpenAIService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OpenAIServiceImpl implements OpenAIService {
    @Value("${openai.api.key}")
    private String apiKey="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";

    /**
     * Build prompt theo tên thể loại
     */
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

    /**
     * Generate image bằng OpenAI
     */
    @Override
    public String generateImage(String genreName) {

        String prompt = buildPrompt(genreName);

        OpenAIClient client = OpenAIOkHttpClient.builder()
                .apiKey(apiKey)
                .build();

        ImageGenerateParams params = ImageGenerateParams.builder()
                .model("gpt-image-1")
                .prompt(prompt)
                .size("1024x1024")
                .build();

        ImagesResponse response = client.images().generate(params);

        return response.data().get(0).url();
    }
}
