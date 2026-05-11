package com.dev.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.entity.Genre;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
        @EntityGraph(attributePaths = {
                        "productGenres",
        })
        List<Genre> findAll();

        @Query("""
                        SELECT g
                        FROM Genre g
                        WHERE LOWER(g.name)
                        LIKE LOWER(CONCAT('%', :keyword, '%'))
                        """)
        Page<Genre> findByNameContainingIgnoreCase(
                        @Param("keyword") String keyword,
                        Pageable pageable);

        @Query("SELECT COUNT(g)>0 FROM Genre g WHERE g.name = :name")
        boolean existsByName(@Param("name") String name);



}
