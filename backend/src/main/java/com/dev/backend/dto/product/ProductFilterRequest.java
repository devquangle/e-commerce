package com.dev.backend.dto.product;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFilterRequest {
    private String keyword;

    private List<String> slugGenres;

    private List<String> slugAuthors;

    private String slugPublisher;

    private String slugSeries;

    private Integer minPrice;

    private Integer maxPrice;

    private Double  rating;

    private Integer page;
    private Integer size;
    private String sort;
}
