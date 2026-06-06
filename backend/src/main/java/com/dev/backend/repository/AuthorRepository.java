package com.dev.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.constant.BaseStatus;
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

}
