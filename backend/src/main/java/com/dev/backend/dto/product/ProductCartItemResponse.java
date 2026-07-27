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
public class ProductCartItemResponse {
    private Integer productId;
    private String name;
    private String slug;
    private String isbn;
    private Integer discountValue;
    private Integer price;
    private Integer quantity;
    private Integer weight;
    private String publishYear;
    private Integer pages;
    private String language;
    private String urlImage;
    private String publisher;
    private String series;
    private List<String> genres;
    private List<String> authors;

}
