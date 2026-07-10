package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.author.AuthorFilterRequest;
import com.dev.backend.dto.author.AuthorRequest;
import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.dto.author.AuthorWithProductCountResponse;
import com.dev.backend.entity.Author;
import com.dev.backend.response.PageResponse;

public interface AuthorService {

    List<AuthorResponse> findAll();


    void validate(AuthorRequest authorRequest);

    void insertData();

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    Author save(Author author);

    Author findById(Integer id);

    AuthorResponse add(AuthorRequest authorRequest);

    AuthorResponse update(Integer id, AuthorRequest authorRequest);

    void delete(Integer id);

    PageResponse<AuthorResponse> search(AuthorFilterRequest request);

    List<AuthorWithProductCountResponse> findActiveAuthorsWithProductCount();
}