package com.dev.backend.dto.product;

import java.time.LocalDateTime;

import com.dev.backend.constant.ProductBadge;

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

    private String urlImage;
  
    private LocalDateTime createdAt;
    private ProductBadge badge;
    private PromotionResponse promotion;
}
