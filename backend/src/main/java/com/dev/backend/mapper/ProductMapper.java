package com.dev.backend.mapper;

import com.dev.backend.dto.product.*;
import com.dev.backend.dto.productdetail.ProductInfo;
import com.dev.backend.entity.*;


import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
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

        if (product.getPromotionProducts() != null) {
            dto.setPromotions(product.getPromotionProducts().stream()
                    .filter(pp -> pp.getPromotion() != null
                            && pp.getPromotion().getStatus() != com.dev.backend.constant.BaseStatus.DELETED)
                    .map(pp -> {
                        ProductResponse.ProductPromotionDto promoDto = new ProductResponse.ProductPromotionDto();
                        promoDto.setId(pp.getPromotion().getId());
                        promoDto.setName(pp.getPromotion().getName());
                        promoDto.setCampaignType(pp.getPromotion().getPromotionCampaignType() != null
                                ? pp.getPromotion().getPromotionCampaignType().name()
                                : "");
                        promoDto.setDiscountPercentage(pp.getDiscountValue());
                        promoDto.setStartDate(
                                pp.getPromotion().getStartDate() != null ? pp.getPromotion().getStartDate().toString()
                                        : "");
                        promoDto.setEndDate(
                                pp.getPromotion().getExpireDate() != null ? pp.getPromotion().getExpireDate().toString()
                                        : "");
                        return promoDto;
                    })
                    .collect(Collectors.toList()));
        }

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

    public ProductInfo mapProductInfo(Product product) {
        ProductInfo dto = new ProductInfo();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setIsbn(product.getIsbn());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setWeight(product.getWeight());
        dto.setPublishYear(product.getPublishYear().toString());
        dto.setPages(product.getPages());
        dto.setLanguage(product.getLanguage());
        dto.setDescription(product.getDescription());

        return dto;
    }

    public ProductCartItemResponse mapProductCartItemResponse(Product product) {
        ProductCartItemResponse dto = new ProductCartItemResponse();
        dto.setProductId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setIsbn(product.getIsbn());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setWeight(product.getWeight());
        dto.setPublishYear(product.getPublishYear().toString());
        dto.setPages(product.getPages());
        dto.setLanguage(product.getLanguage());
        return dto;
    }

    
}