package com.dev.backend.dto.grop;
import java.util.List;



public record BookMetadataResponse(
        String summary,
        List<String> highlights,
        List<String> targetAudience

) {
}