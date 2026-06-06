package com.dev.backend.service;

import com.dev.backend.dto.author.AuthorRequest;
import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.entity.Author;
import com.dev.backend.response.PageResponse;

public interface AuthorService {
    void validate();

    void insertData();

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    Author save(Author author);

    Author add(AuthorRequest authorRequest);

    PageResponse<AuthorResponse> pageGenre(int page, int size, String keyword);

}