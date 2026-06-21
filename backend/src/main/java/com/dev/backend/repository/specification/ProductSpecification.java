package com.dev.backend.repository.specification;

import com.dev.backend.dto.product.ProductFilterRequest;
import com.dev.backend.entity.*;
import jakarta.persistence.criteria.*;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Predicate buildPredicate(Root<Product> root, CriteriaBuilder cb, ProductFilterRequest request) {
        List<Predicate> predicates = new ArrayList<>();

        if (StringUtils.hasText(request.getKeyword())) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + request.getKeyword().toLowerCase() + "%"));
        }
        
        if (request.getGenres() != null && !request.getGenres().isEmpty()) {
            Join<Product, ProductGenre> pgJoin = root.join("productGenres", JoinType.INNER);
            Join<ProductGenre, Genre> genreJoin = pgJoin.join("genre", JoinType.INNER);
            predicates.add(genreJoin.get("slug").in(request.getGenres()));
        }

        if (request.getAuthors() != null && !request.getAuthors().isEmpty()) {
            Join<Product, ProductAuthor> paJoin = root.join("productAuthors", JoinType.INNER);
            Join<ProductAuthor, Author> authorJoin = paJoin.join("author", JoinType.INNER);
            predicates.add(authorJoin.get("slug").in(request.getAuthors()));
        }

        if (StringUtils.hasText(request.getPublisher())) {
            Join<Product, Publisher> pubJoin = root.join("publisher", JoinType.INNER);
            predicates.add(cb.equal(pubJoin.get("slug"), request.getPublisher()));
        }

        if (StringUtils.hasText(request.getSeries())) {
            Join<Product, Series> seriesJoin = root.join("series", JoinType.INNER);
            predicates.add(cb.equal(seriesJoin.get("slug"), request.getSeries()));
        }

        if (request.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.getMinPrice()));
        }

        if (request.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.getMaxPrice()));
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
