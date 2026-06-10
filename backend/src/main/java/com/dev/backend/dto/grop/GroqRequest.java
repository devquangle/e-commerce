package com.dev.backend.dto.grop;

import java.util.List;

public record GroqRequest(
        String model,
        List<Message> messages
) {
}