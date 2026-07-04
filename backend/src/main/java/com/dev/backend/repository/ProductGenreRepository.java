package com.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.dto.genre.ProductGenresResponse;
import com.dev.backend.entity.ProductGenre;

public interface ProductGenreRepository extends JpaRepository<ProductGenre, Integer> {

    @Query("SELECT COUNT(pg)>0 FROM ProductGenre pg WHERE pg.genre.id = :genreId")
    boolean existsByGenreId(@Param("genreId") Integer genreId);

    @Modifying 
    @Query("DELETE FROM ProductGenre pg WHERE pg.product.id = :productId")
    void deleteByProductId(@Param("productId") Integer productId);

    @Query("""
          SELECT new com.dev.backend.dto.genre.ProductGenresResponse(
              pa.genre.id,
              pa.genre.name,
              pa.genre.slug
          )
          FROM ProductGenre pg
          WHERE pg.product.id = :productId
          ORDER BY pa.genre.name
      """)
  List<ProductGenresResponse> findGenresByProductId(@Param("productId") Integer productId);
}
