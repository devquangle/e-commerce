package com.dev.backend.service;

import com.dev.backend.dto.author.AuthorRequest;
import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.entity.Author;
import com.dev.backend.response.PageResponse;

public interface AuthorService {
    void validate(AuthorRequest authorRequest);

    void insertData();

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    Author save(Author author);

    Author findById(Integer id);

    AuthorResponse add(AuthorRequest authorRequest);

    AuthorResponse update(Integer id, AuthorRequest authorRequest);

    PageResponse<AuthorResponse> pages(int page, int size, String keyword, String status);

}