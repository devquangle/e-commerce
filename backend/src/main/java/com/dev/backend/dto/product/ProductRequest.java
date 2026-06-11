package com.dev.backend.dto.product;

import java.time.LocalDate;
import java.util.List;

import com.dev.backend.dto.image.ImageResponse;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    private String name;
    private String isbn;
    private Integer originalPrice;
    private Integer price;
    private Integer quantity;
    private Integer weight;
    private LocalDate publishYear;
    private Integer pages;

    private Integer publisherId;
    private Integer seriesId;
    private String status;
    private String description;

    private List<Integer> authorIds;
    private List<Integer> genreIds;

    private List<ImageResponse> coverImages;

}