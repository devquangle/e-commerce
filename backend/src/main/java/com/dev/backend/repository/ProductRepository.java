package com.dev.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.dev.backend.constant.ProductStatus;
import com.dev.backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer>, ProductRepositoryCustom {

        @Query("""
                        SELECT p
                        FROM Product p
                        WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        AND (:status IS NULL OR p.status = :status)
                        """)
        Page<Product> filterProducts(
                        @Param("keyword") String keyword,
                        @Param("status") ProductStatus status,
                        Pageable pageable);

        @EntityGraph(attributePaths = {
                        "publisher",
                        "series",
                        "promotionProducts"

        })
        Optional<Product> findBySlug(@Param("slug") String slug);

        Optional<Product> findByName(@Param("name") String name);

        @EntityGraph(attributePaths = {
                        "publisher",
                        "series",
                        "promotionProducts",
        })
        Optional<Product> findWithDetailsById(@Param("id") Integer id);
}
