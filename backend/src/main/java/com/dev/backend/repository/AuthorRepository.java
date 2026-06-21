package com.dev.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.dto.author.AuthorWithProductCountResponse;
import com.dev.backend.entity.Author;

public interface AuthorRepository extends JpaRepository<Author, Integer> {

    @Query("""
            SELECT a
            FROM Author a
            WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            AND (:status IS NULL OR a.status = :status)
            """)
    Page<Author> findByNameContainingIgnoreCase(
            @Param("keyword") String keyword,
            @Param("status") BaseStatus status,
            Pageable pageable);

    @Query("SELECT COUNT(a) > 0 FROM Author a WHERE a.name = :name")
    boolean existsByName(@Param("name") String name);

    @Query("SELECT COUNT(a) > 0 FROM Author a WHERE a.slug = :slug")
    boolean existsBySlug(@Param("slug") String slug);

    @Query("""
                SELECT new com.dev.backend.dto.author.AuthorWithProductCountResponse(
                    a.id,
                    a.name,
                    a.slug,
                    a.urlImage,
                    a.description,
                    COUNT(DISTINCT p.id)
                )
                FROM Author a
                LEFT JOIN a.productAuthors pa
                LEFT JOIN pa.product p
                    ON p.status = com.dev.backend.constant.ProductStatus.ACTIVE
                WHERE a.status = com.dev.backend.constant.BaseStatus.ACTIVE
                GROUP BY a.id, a.name, a.slug, a.urlImage
                ORDER BY COUNT(DISTINCT p.id) DESC
            """)
    List<AuthorWithProductCountResponse> findActiveAuthorsWithProductCount();

}
