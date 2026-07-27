package com.dev.backend.dto.productsnapshot;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ProductSnapshot {

    private Integer id;

    private String slug;

    private String name;

    private String image;

    private List<String> authors;

    private String publisher;

    private List<String> genres;

    private String language;

    private Integer pageCount;

    private Integer weight;
}