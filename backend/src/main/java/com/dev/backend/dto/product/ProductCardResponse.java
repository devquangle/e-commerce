package com.dev.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductCardResponse {
    private Integer id;
    private String slug;
    private String name;
    private Integer soldCount;
    private Double rating;
    private Integer reviewCount;
    private Integer price;
    private String bage;
    private String urlImage;
    private Integer promotionValue;

}
