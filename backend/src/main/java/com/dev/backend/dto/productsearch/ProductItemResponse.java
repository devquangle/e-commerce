package com.dev.backend.dto.productsearch;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductItemResponse {
    private Integer id;
    private String name;
    private String slug;
    private String isbn;
    private Integer originalPrice;
    private Integer price;
    private Integer quantity;

    private Integer weight;
    private String publishYear;
    private Integer pages;
    private String language;
    private Integer seriesId;
    private Integer publisherId;
    private String status;
    private String description;

    private List<Integer> authorIds;
    private List<Integer> genreIds;

    private List<ProductImageResponse> coverImages;

    @Data
    public static class ProductImageResponse {
        private String url;
        private Boolean isThumbnail;
    }

    @Data
    public static class ProductAuthorsResponse {
        private String slug;
        private String name;
    }

    @Data
    public static class ProductGenresResponse {
        private String slug;
        private String name;
    }

    @Data
    public static class ProductPublisherResponse {
        private String slug;
        private String name;
    }

    @Data
    public static class ProductSeriesResponse {
        private String slug;
        private String name;
    }
}
