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
    private Integer originalPrice;
    private Integer price;
    private Integer quantity;
    private Integer weight;
    private LocalDate publishYear;
    private Integer pages;

    private List<Integer> authorIds;
    private List<Integer> genreIds;

    private Integer publisherId;
    private Integer seriesId;

    private String status;

    private List<ImageResponse> coverImages;

    private String description;


}