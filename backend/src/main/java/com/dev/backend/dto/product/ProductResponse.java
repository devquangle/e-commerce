package com.dev.backend.dto.product;

import java.time.LocalDate;
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
    private String publisherName;
    private String seriesName;
    private String urlImageDefault;

    private List<ProductAuthorResponse> productAuthors = new ArrayList<>();
    private List<ProductGenreResponse> productGenres = new ArrayList<>();
}
