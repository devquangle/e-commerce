package com.dev.backend.dto;

import java.util.List;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductInfoResponse {
    private String name;
    private String slug;
    private String isbn;
    private Integer originalPrice;
    private Integer price;
    private Integer quantity;

    private Integer weight;
    private String publishYear;
    private Integer pages;

    private List<String> authorsName;
    private List<String> genresName;
    private String publisherName;
    private String seriesName;
    private String urlImageDefault;

}
