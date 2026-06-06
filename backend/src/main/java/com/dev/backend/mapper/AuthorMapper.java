package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.entity.Author;
@Component
public class AuthorMapper {
    public AuthorResponse toDTO(Author author) {
        if (author == null) {
            return null;
        }
        AuthorResponse authorResponse = new AuthorResponse();
        authorResponse.setId(author.getId());
        authorResponse.setName(author.getName());
        authorResponse.setWikibaseItem(author.getWikibaseItem());
        authorResponse.setUrlImage(author.getUrlImage());
        authorResponse.setUrlBio(author.getUrlBio());
        authorResponse.setDescription(author.getDescription());
        authorResponse.setStatus(author.getStatus());
        return authorResponse;

    }

}
