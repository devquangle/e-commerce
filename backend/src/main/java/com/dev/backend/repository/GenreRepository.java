package com.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dev.backend.entity.Genre;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
    @EntityGraph(attributePaths = {
            "productGenres",
    })
    List<Genre> findAll();


}
