package com.dev.backend.dto.grop;

import java.util.List;

public record AuthorInfo(
        String name,
        List<String> notableWorks
) {
}