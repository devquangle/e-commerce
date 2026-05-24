package com.dev.backend.mapper;

import com.dev.backend.constant.AuthorType;
import com.dev.backend.dto.author.AuthorResponse;

public class AuthorMapper {
    public static AuthorResponse toDTO(AuthorType authorType) {
        if (authorType == null) {
            return null;
        }
        return new AuthorResponse(
                authorType.getId(),
                authorType.name(),
                authorType.getDisplayName()
        );
    }

}
