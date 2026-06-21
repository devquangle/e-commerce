package com.dev.backend.dto.product;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.dev.backend.entity.Author;
import com.dev.backend.entity.Genre;
import com.dev.backend.entity.Product;
import com.dev.backend.entity.ProductAuthor;
import com.dev.backend.entity.ProductGenre;
import com.dev.backend.entity.Publisher;
import com.dev.backend.entity.Series;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {

    public static Specification<Product> filter(
            ProductFilterRequest req) {

        return (root, query, cb) -> {

            query.distinct(true);

            List<Predicate> predicates = new ArrayList<>();

            // keyword
            if (StringUtils.hasText(req.getKeyword())) {

                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + req.getKeyword().toLowerCase() + "%"
                        )
                );
            }

            // genre
            if (req.getGenres() != null && !req.getGenres().isEmpty()) {

                Join<Product, ProductGenre> productGenreJoin =
                        root.join("productGenres", JoinType.LEFT);

                Join<ProductGenre, Genre> genreJoin =
                        productGenreJoin.join("genre", JoinType.LEFT);

                predicates.add(
                        genreJoin.get("slug").in(req.getGenres())
                );
            }

            // author
            if (req.getAuthors() != null && !req.getAuthors().isEmpty()) {

                Join<Product, ProductAuthor> productAuthorJoin =
                        root.join("productAuthors", JoinType.LEFT);

                Join<ProductAuthor, Author> authorJoin =
                        productAuthorJoin.join("author", JoinType.LEFT);

                predicates.add(
                        authorJoin.get("slug").in(req.getAuthors())
                );
            }

            // publisher
            if (StringUtils.hasText(req.getPublisher())) {

                Join<Product, Publisher> publisherJoin =
                        root.join("publisher", JoinType.LEFT);

                predicates.add(
                        cb.equal(
                                publisherJoin.get("slug"),
                                req.getPublisher()
                        )
                );
            }

            // series
            if (StringUtils.hasText(req.getSeries())) {

                Join<Product, Series> seriesJoin =
                        root.join("series", JoinType.LEFT);

                predicates.add(
                        cb.equal(
                                seriesJoin.get("slug"),
                                req.getSeries()
                        )
                );
            }

            // min price
            if (req.getMinPrice() != null) {

                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("price"),
                                req.getMinPrice()
                        )
                );
            }

            // max price
            if (req.getMaxPrice() != null) {

                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("price"),
                                req.getMaxPrice()
                        )
                );
            }

           

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}