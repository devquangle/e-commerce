package com.dev.backend.dto.product;

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
    private Integer originalPrice;
    private Integer price;
    private Integer quantity;

    private Integer weight;
    private String publishYear;
    private Integer pages;
    private String language;
    private String status;

    private List<String> authorsName;
    private List<String> genresName;
    private String publisherName;
    private String seriesName;
    private String urlImageDefault;

}
