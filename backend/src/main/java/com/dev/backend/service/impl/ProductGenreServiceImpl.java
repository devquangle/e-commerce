package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.entity.Genre;
import com.dev.backend.entity.Product;
import com.dev.backend.entity.ProductGenre;
import com.dev.backend.repository.ProductGenreRepository;
import com.dev.backend.service.ProductGenreService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductGenreServiceImpl implements ProductGenreService {

    private final ProductGenreRepository productGenreRepository;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public boolean existsByGenreId(Integer genreId) {
        return productGenreRepository.existsByGenreId(genreId);
    }

    @Override
    public ProductGenre save(ProductGenre productGenre) {
        return productGenreRepository.save(productGenre);
    }

    @Override
    @Transactional
    public void saveProductGenres(Product product, List<Integer> genreIds) {
        productGenreRepository.deleteByProductId(product.getId());
        if (genreIds == null || genreIds.isEmpty()) {
            return;
        }

        List<ProductGenre> productGenresToSave = new ArrayList<>();
        List<Integer> uniqueGenreIds = genreIds.stream()
                .distinct()
                .toList();
        for (Integer genreId : uniqueGenreIds) {
            ProductGenre productGenre = new ProductGenre();
            productGenre.setProduct(product);
            Genre genreProxy = entityManager.getReference(Genre.class, genreId);
            productGenre.setGenre(genreProxy);
            productGenresToSave.add(productGenre);
        }
        productGenreRepository.saveAll(productGenresToSave);
    }
}
