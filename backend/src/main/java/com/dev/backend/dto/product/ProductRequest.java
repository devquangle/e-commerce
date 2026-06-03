package com.dev.backend.dto.product;

import java.util.Date;
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
    private Integer originalPrice;
    private Integer price;
    private Integer quantity;

    private Integer weight;
    private Date publishYear;
    private Integer pages;
    private List<Integer> authorIds;

    private List<Integer> genreIds;
    private Integer seriesId;
    private Integer publisherId;
    
    private String status;

    private String description;

}
