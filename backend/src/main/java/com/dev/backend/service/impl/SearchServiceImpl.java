package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.dev.backend.dto.searchapi.SearchApiResponse;
import com.dev.backend.dto.searchapi.UrlImageResponse;
import com.dev.backend.service.SearchApiService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchApiService {
    private final RestTemplate restTemplate;

    @Override
    public UrlImageResponse getTop5ImageLinks(String keyword) {
        String url = UriComponentsBuilder.fromUriString("https://www.searchapi.io/api/v1/search")
                .queryParam("engine", "google_images")
                .queryParam("q", keyword)
                .queryParam("gl", "vn")
                .queryParam("hl", "vi")
                .queryParam("api_key", "K77tHqsk2AkFMiZrrzBCtJbR")
                .build()
                .toUriString();

        try {
            SearchApiResponse response = restTemplate.getForObject(url, SearchApiResponse.class);

            if (response != null && response.getImages() != null) {
                List<String> links = response.getImages().stream()
                        .filter(img -> img.getOriginal() != null && img.getOriginal().getLink() != null)
                        .limit(5)
                        .map(img -> img.getOriginal().getLink())
                        .collect(Collectors.toList());

                return new UrlImageResponse(links);
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi API SearchAPI cho từ khóa {}: {}", keyword, e.getMessage());
        }

        return new UrlImageResponse(new ArrayList<>());
    }
}
