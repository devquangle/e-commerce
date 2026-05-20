package com.dev.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.genai.Client;

@Configuration
public class GeminiConfig {
    // @Value("${gemini.api-key}")
    private String apiKey = "AIzaSyDSUCLmcyo9o04i2HUwZbt-RJ8c_Tvq7ps";

    @Bean
    public Client geminiClient() {
        return Client.builder()
                .apiKey(apiKey)
                .build();
    }
}
