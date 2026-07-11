package com.dev.backend.dto.product;

import java.time.LocalDate;


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

    private Integer price;
    private Integer discountValue;

    private Integer soldCount;
    private Double rating;
    private Integer reviewCount;

    private String urlImage;
  
    private LocalDate createdAt;


}
