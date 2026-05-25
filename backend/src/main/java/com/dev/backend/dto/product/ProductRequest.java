package com.dev.backend.dto.product;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductRequest {
    private String name;
    private BigDecimal originalPrice;
    private BigDecimal price;
    private Integer quantity;

    private List<Integer> genreIds;
    private List<Integer> authorIds;

    private Integer publisherId;
    
    private String status;

    private String description;

}
