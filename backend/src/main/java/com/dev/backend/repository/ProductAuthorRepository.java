package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.backend.entity.ProductAuthor;

@Repository
public interface ProductAuthorRepository extends JpaRepository<ProductAuthor, Integer> {
    @Query("SELECT COUNT(pa)>0 FROM ProductAuthor pa WHERE pa.author.id = :authorId")
    boolean existsByAuthorId(@Param("authorId") Integer authorId);
}
