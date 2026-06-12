package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.entity.Author;
import com.dev.backend.entity.Product;
import com.dev.backend.entity.ProductAuthor;
import com.dev.backend.repository.ProductAuthorRepository;
import com.dev.backend.service.ProductAuthorService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductAuthorServiceImpl implements ProductAuthorService {
    private final ProductAuthorRepository productAuthorRepository;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ProductAuthor save(ProductAuthor productAuthor) {
        return productAuthorRepository.save(productAuthor);
    }

    @Transactional
    @Override
    public void saveProductAuthors(Product product, List<Integer> authorIds) {
        productAuthorRepository.deleteById(product.getId());
        if (authorIds == null || authorIds.isEmpty()) {
            return;
        }

        List<ProductAuthor> productAuthorsToSave = new ArrayList<>();
        List<Integer> uniqueAuthorIds = authorIds.stream()
                .distinct()
                .toList();
        for (Integer authorId : uniqueAuthorIds) {
            ProductAuthor productAuthor = new ProductAuthor();
            productAuthor.setProduct(product);
            Author authorProxy = entityManager.getReference(Author.class, authorId);
            productAuthor.setAuthor(authorProxy);
            productAuthorsToSave.add(productAuthor);
        }
        productAuthorRepository.saveAll(productAuthorsToSave);
    }

}
