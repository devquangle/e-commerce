package com.dev.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.dev.backend.constant.BaseStatus;
import com.dev.backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer>, ProductRepositoryCustom {

    @Query("""
            SELECT DISTINCT p
            FROM Product p
            LEFT JOIN p.productAuthors pa
            LEFT JOIN pa.author auth
            LEFT JOIN p.productGenres pg
            LEFT JOIN pg.genre gen
            WHERE (
                LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(auth.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(gen.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            AND (:status IS NULL OR p.status = :status)
            """)
    Page<Product> findByNameContainingIgnoreCase(
            @Param("keyword") String keyword,
            @Param("status") BaseStatus status,
            Pageable pageable);

    @EntityGraph(attributePaths = {
            "publisher",
            "series",
            "images",
            "productAuthors.author",
            "productGenres.genre"
    })
    Optional<Product> findBySlug(String slug);
}
