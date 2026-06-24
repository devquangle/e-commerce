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
                        SELECT p
                        FROM Product p
                        WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        AND (:status IS NULL OR p.status = :status)
                        """)
        Page<Product> findByNameContainingIgnoreCase(
                        @Param("keyword") String keyword,
                        @Param("status") BaseStatus status,
                        Pageable pageable);

        @EntityGraph(attributePaths = {
                        "publisher",
                        "series"
        })
        Optional<Product> findBySlug(String slug);

        Optional<Product> findByName(String name);
}
