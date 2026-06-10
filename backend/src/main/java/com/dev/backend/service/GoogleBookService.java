package com.dev.backend.service;

import com.dev.backend.dto.googlebook.GoogleBookApiResponse;
import com.dev.backend.dto.googlebook.GoogleBookResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleBookService {

    private final RestTemplate restTemplate;

    private static final String GOOGLE_BOOK_API = "https://www.googleapis.com/books/v1/volumes";

    private final String apiKey = "AIzaSyCII7LDF1TrOtjymE4SWf1Di9rqryKIIe4";

    public List<GoogleBookResponse> searchBooks(String query) {

        log.info("Searching Google Books: {}", query);

        try {

            String url = GOOGLE_BOOK_API +
                    "?q={query}" +
                    "&maxResults=20" +
                    "&key={key}";

            GoogleBookApiResponse apiResponse = restTemplate.getForObject(
                    url,
                    GoogleBookApiResponse.class,
                    query.trim(),
                    apiKey);

            if (apiResponse == null
                    || apiResponse.getItems() == null
                    || apiResponse.getItems().isEmpty()) {

                log.warn("No books found: {}", query);
                return Collections.emptyList();
            }

            return apiResponse.getItems()
                    .stream()
                    .filter(item -> item.getVolumeInfo() != null)
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

        } catch (Exception e) {

            log.error("Error calling Google Books API", e);

            throw new RuntimeException(
                    "Failed to fetch Google Books API",
                    e);
        }
    }

    private GoogleBookResponse convertToResponse(
            GoogleBookApiResponse.BookItem item) {

        GoogleBookResponse response = new GoogleBookResponse();

        response.setVolumeId(item.getId());

        if (item.getVolumeInfo() != null) {

            GoogleBookApiResponse.VolumeInfo volumeInfo = item.getVolumeInfo();

            response.setName(volumeInfo.getTitle());

            response.setAuthors(volumeInfo.getAuthors());
            response.setPublishedDate(volumeInfo.getPublishedDate());

            response.setDescription(volumeInfo.getDescription() != null ? volumeInfo.getDescription(): "");

            response.setPageCount(volumeInfo.getPageCount());

            if (volumeInfo.getImageLinks() != null) {
                response.setThumbnail(volumeInfo.getImageLinks().getThumbnail());
            }

            response.setIsbn(extractIsbn(volumeInfo));
        }

        if (item.getSaleInfo() != null) {

            GoogleBookApiResponse.SaleInfo saleInfo = item.getSaleInfo();

            if (saleInfo.getListPrice() != null) {
                response.setListPrice(saleInfo.getListPrice().getAmount());
            }

            if (saleInfo.getRetailPrice() != null) {
                response.setRetailPrice(saleInfo.getRetailPrice().getAmount());
            }
        }

        return response;
    }

    private String extractIsbn(
            GoogleBookApiResponse.VolumeInfo volumeInfo) {

        if (volumeInfo.getIndustryIdentifiers() == null) {
            return null;
        }

        return volumeInfo.getIndustryIdentifiers()
                .stream()
                .filter(i -> "ISBN_13".equals(i.getType()))
                .map(i -> i.getIdentifier())
                .findFirst()
                .orElse(
                        volumeInfo.getIndustryIdentifiers()
                                .stream()
                                .filter(i -> "ISBN_10".equals(i.getType()))
                                .map(i -> i.getIdentifier())
                                .findFirst()
                                .orElse(null));
    }
}