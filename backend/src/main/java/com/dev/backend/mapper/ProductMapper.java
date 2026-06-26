package com.dev.backend.mapper;

import com.dev.backend.dto.product.*;
import com.dev.backend.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductResponse toDTO(Product product) {
        if (product == null)
            return null;

        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setWeight(product.getWeight());
        dto.setPages(product.getPages());
        dto.setLanguage(product.getLanguage());

        dto.setPublishYear(product.getPublishYear() != null ? product.getPublishYear().toString() : null);
        dto.setStatus(product.getStatus() != null ? product.getStatus().name() : null);

        dto.setPublisherName(product.getPublisher() != null ? product.getPublisher().getName() : null);
        dto.setSeriesName(product.getSeries() != null ? product.getSeries().getName() : null);

        // Fixed: Maps to List<String> as required by ProductResponse
        dto.setAuthorsName(mapAuthorsToNames(product.getProductAuthors()));
        dto.setGenresName(mapGenresToNames(product.getProductGenres()));
        dto.setUrlImageDefault(urlImageDefault(product.getImages()));

        return dto;
    }

    public ProductDetailResponse toDetail(Product product) {
        if (product == null)
            return null;

        ProductDetailResponse dto = new ProductDetailResponse();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setIsbn(product.getIsbn());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setWeight(product.getWeight());
        dto.setPublishYear(product.getPublishYear() != null ? product.getPublishYear().toString() : null);
        dto.setPages(product.getPages());
        dto.setLanguage(product.getLanguage());
        dto.setPublisherId(product.getPublisher() != null ? product.getPublisher().getId() : null);
        dto.setSeriesId(product.getSeries() != null ? product.getSeries().getId() : null);

        // Fixed: Null-safe status mapping
        dto.setStatus(product.getStatus() != null ? product.getStatus().name() : null);
        dto.setDescription(product.getDescription());

        dto.setAuthorIds(mapAuthorsToIds(product.getProductAuthors()));
        dto.setGenreIds(mapGenresToIds(product.getProductGenres()));
        dto.setCoverImages(coverImageResponses(product.getImages()));

        return dto;
    }

    // Helper: Map Authors to Names
    private List<String> mapAuthorsToNames(List<ProductAuthor> list) {
        if (list == null)
            return List.of();
        return list.stream()
                .filter(pa -> pa.getAuthor() != null)
                .map(pa -> pa.getAuthor().getName())
                .collect(Collectors.toList());
    }

    // Helper: Map Genres to Names
    private List<String> mapGenresToNames(List<ProductGenre> list) {
        if (list == null)
            return List.of();
        return list.stream()
                .filter(pg -> pg.getGenre() != null)
                .map(pg -> pg.getGenre().getName())
                .collect(Collectors.toList());
    }

    // Helper: Map Authors to IDs
    private List<Integer> mapAuthorsToIds(List<ProductAuthor> list) {
        if (list == null)
            return List.of();
        return list.stream()
                .filter(pa -> pa.getAuthor() != null)
                .map(pa -> pa.getAuthor().getId())
                .collect(Collectors.toList());
    }

    // Helper: Map Genres to IDs
    private List<Integer> mapGenresToIds(List<ProductGenre> list) {
        if (list == null)
            return List.of();
        return list.stream()
                .filter(pg -> pg.getGenre() != null)
                .map(pg -> pg.getGenre().getId())
                .collect(Collectors.toList());
    }

    private String urlImageDefault(List<Image> images) {
        if (images == null || images.isEmpty())
            return "";
        return images.stream()
                .filter(img -> img != null && img.isThumbnail())
                .map(img -> img.getUrlImage())
                .findFirst()
                .orElse(images.get(0) != null ? images.get(0).getUrlImage() : "");
    }

    private List<ProductImageResponse> coverImageResponses(List<Image> images) {
        if (images == null || images.isEmpty())
            return List.of();
        return images.stream()
                .filter(img -> img != null)
                .map(img -> {
                    ProductImageResponse res = new ProductImageResponse();
                    res.setUrl(img.getUrlImage());
                    res.setIsThumbnail(img.isThumbnail());
                    return res;
                }).collect(Collectors.toList());
    }
}