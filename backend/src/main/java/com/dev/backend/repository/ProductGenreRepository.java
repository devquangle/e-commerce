package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import com.dev.backend.entity.ProductGenre;


public interface ProductGenreRepository extends JpaRepository<ProductGenre, Integer> {

    @Query("SELECT COUNT(pg)>0 FROM ProductGenre pg WHERE pg.genre.id = :genreId")
    boolean existsByGenreId(@Param("genreId") Integer genreId);

}
