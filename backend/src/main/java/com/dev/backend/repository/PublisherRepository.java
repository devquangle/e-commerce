package com.dev.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import com.dev.backend.constant.BaseStatus;
import com.dev.backend.entity.Publisher;


public interface PublisherRepository extends JpaRepository<Publisher, Integer> {
    @Query("""
            SELECT a
            FROM Publisher a
            WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            AND (:status IS NULL OR a.status = :status)
            """)
    Page<Publisher> findByNameContainingIgnoreCase(
            @Param("keyword") String keyword,
            @Param("status") BaseStatus status,
            Pageable pageable);

    @Query("SELECT COUNT(a) > 0 FROM Publisher a WHERE a.name = :name")
    boolean existsByName(@Param("name") String name);

    @Query("SELECT COUNT(a) > 0 FROM Publisher a WHERE a.slug = :slug")
    boolean existsBySlug(@Param("slug") String slug);
}
