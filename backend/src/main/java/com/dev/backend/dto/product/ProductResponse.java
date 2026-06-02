package com.dev.backend.dto.product;

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
    private Integer originalPrice;
    private Integer price;
    private Integer quantity;

    private Integer weight;
    private Integer publishYear;
    private Integer pageCount;
}
