package com.dev.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.dto.genre.GenreWithProductCountResponse;
import com.dev.backend.dto.genre.UserGenreResponse;
import com.dev.backend.entity.Genre;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
    @EntityGraph(attributePaths = {
            "productGenres",
    })
    List<Genre> findAll();

    @Query("""
                SELECT g
                FROM Genre g
                WHERE (
                    :keyword IS NULL
                    OR TRIM(:keyword) = ''
                    OR LOWER(g.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                AND (
                    :status IS NULL
                    OR g.status = :status
                )
            """)
    Page<Genre> filterGenres(
            @Param("keyword") String keyword,
            @Param("status") BaseStatus status,
            Pageable pageable);

    @Query("SELECT COUNT(g)>0 FROM Genre g WHERE g.name = :name")
    boolean existsByName(@Param("name") String name);

    @Query("""
                 SELECT new com.dev.backend.dto.genre.GenreWithProductCountResponse(
                      g.id,
                      g.name,
                      g.slug,
                      g.urlImage,
                      COUNT(p.id)
                  )
                FROM Genre g
                LEFT JOIN g.productGenres pg
                LEFT JOIN pg.product p
                WHERE g.status = BaseStatus.ACTIVE
                  AND (p IS NULL OR p.status = ProductStatus.ACTIVE)
                GROUP BY g.id, g.name,g.slug, g.urlImage
                ORDER BY g.name
            """)
    List<GenreWithProductCountResponse> findActiveGenresWithProductCount();

}
