package com.dev.backend.service;


import com.dev.backend.dto.searchapi.UrlImageResponse;

public interface SearchApiService {
    UrlImageResponse getTop5ImageLinks(String keyword);
}
