package com.dev.backend.dto.product;

import java.util.List;

import com.dev.backend.dto.author.ProductAuthorsResponse;
import com.dev.backend.dto.genre.ProductGenresResponse;
import com.dev.backend.dto.publisher.ProductPublisherResponse;
import com.dev.backend.dto.series.ProductSeriesResponse;

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
    private ProductPublisherResponse productPublisher;
    private ProductSeriesResponse productSeries;
    private List<ProductGenresResponse> productGenres;
    private List<ProductAuthorsResponse> productAuthors;

}
