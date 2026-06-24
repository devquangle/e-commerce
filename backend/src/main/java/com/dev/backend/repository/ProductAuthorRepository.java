package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.entity.ProductAuthor;



public interface ProductAuthorRepository extends JpaRepository<ProductAuthor, Integer> {
    @Query("SELECT COUNT(pa)>0 FROM ProductAuthor pa WHERE pa.author.id = :authorId")
    boolean existsByAuthorId(@Param("authorId") Integer authorId);

    @Modifying
    @Query("DELETE FROM ProductAuthor pa WHERE pa.product.id = :productId")
    void deleteByProductId(@Param("productId") Integer productId);
}
