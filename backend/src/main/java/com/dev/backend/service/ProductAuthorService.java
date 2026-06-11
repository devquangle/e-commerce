package com.dev.backend.service;

import java.util.List;

import com.dev.backend.entity.Product;
import com.dev.backend.entity.ProductAuthor;

public interface ProductAuthorService {
    ProductAuthor save(ProductAuthor productAuthor);
    void saveProductAuthors(Product product,List<Integer> authorIds);
}
