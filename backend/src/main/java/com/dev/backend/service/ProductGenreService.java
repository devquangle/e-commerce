package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.genre.ProductGenresResponse;
import com.dev.backend.entity.Product;
import com.dev.backend.entity.ProductGenre;

public interface ProductGenreService {
    boolean existsByGenreId(Integer genreId);

    ProductGenre save(ProductGenre productGenre);

    void saveProductGenres(Product product, List<Integer> genreIds);

    List<ProductGenresResponse> findGenresByProductId(Integer productId);
}
