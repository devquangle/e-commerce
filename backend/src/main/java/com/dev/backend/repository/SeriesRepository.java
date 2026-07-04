package com.dev.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.dto.series.SeriesWithProductCountResponse;
import com.dev.backend.entity.Series;

public interface SeriesRepository extends JpaRepository<Series, Integer> {
    @Query("""
            SELECT a
            FROM Series a
            WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            AND (:status IS NULL OR a.status = :status)
            """)
    Page<Series> findByNameContainingIgnoreCase(
            @Param("keyword") String keyword,
            @Param("status") BaseStatus status,
            Pageable pageable);

    @Query("SELECT COUNT(a) > 0 FROM Series a WHERE a.name = :name")
    boolean existsByName(@Param("name") String name);

    @Query("SELECT COUNT(a) > 0 FROM Series a WHERE a.slug = :slug")
    boolean existsBySlug(@Param("slug") String slug);

    @Query("""
                 SELECT new com.dev.backend.dto.series.SeriesWithProductCountResponse(
                     s.id,
                     s.name,
                     s.slug,
                     COUNT(p.id)
                 )
                 FROM Series s
                 LEFT JOIN s.products p
                     ON p.status = com.dev.backend.constant.ProductStatus.ACTIVE
                 WHERE s.status = com.dev.backend.constant.BaseStatus.ACTIVE
                 GROUP BY s.id, s.name, s.slug

            ORDER BY COUNT(DISTINCT p.id) DESC

             """)
    List<SeriesWithProductCountResponse> findActiveSeriesWithProductCount();


}
