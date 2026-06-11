package com.dev.backend.dto.product;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductResponse {
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

    private Integer seriesId;
    private Integer publisherId;
    private String status;
    private String description;

    private List<Integer> authorIds;
    private List<Integer> genreIds;
    private String publisherName;
    private String seriesName;
    private String urlImageDefault;
    private List<ProductImageResponse> coverImages;
    private List<ProductAuthorResponse> productAuthors;
    private List<ProductGenreResponse> productGenres;
}
