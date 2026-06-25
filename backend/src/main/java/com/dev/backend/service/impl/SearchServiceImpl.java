package com.dev.backend.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.dto.searchapi.SearchApiResponse;
import com.dev.backend.service.SearchApiService;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchApiService {
    @Override
    public List<String> getTop5ImageLinks(String keyword) {
        RestTemplate restTemplate = new RestTemplate();
        // Cần truyền API Key từ file config hoặc env
        String url = "https://www.searchapi.io/api/v1/search?engine=google_images&q=" + keyword
                + "&gl=vn&hl=vi&api_key=K77tHqsk2AkFMiZrrzBCtJbR";

        SearchApiResponse response = restTemplate.getForObject(url, SearchApiResponse.class);

        if (response != null && response.getImages() != null) {
            return response.getImages().stream()
                    .filter(item -> item.getOriginal() != null) 
                    .limit(5)
                    .map(item -> item.getOriginal().getLink()) 
                    .collect(Collectors.toList());
        }
        return List.of();
    }
}
