package com.dev.backend.dto.productsnapshot;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ProductSnapshot {
    private Integer id;
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
