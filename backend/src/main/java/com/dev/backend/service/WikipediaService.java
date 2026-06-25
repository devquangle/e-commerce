package com.dev.backend.service;

import com.dev.backend.dto.wikipedia.WikipediaResponse;

public interface WikipediaService {

    WikipediaResponse fetchApiInforAuthor(String name);

    boolean checkWikidataClaims(String qid);
}