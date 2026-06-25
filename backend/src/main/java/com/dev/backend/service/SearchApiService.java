package com.dev.backend.service;

import java.util.List;

public interface SearchApiService {
    List<String> getTop5ImageLinks(String keyword);
}
