package com.dev.backend.dto.product;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFilterRequest {
    private String keyword;

    private List<String> genres;

    private List<String> authors;

    private String publisher;

    private String series;

    private Integer minPrice;

    private Integer maxPrice;

    private Double  rating;

    private Integer page;
    private Integer size;
    private String sort;
}
