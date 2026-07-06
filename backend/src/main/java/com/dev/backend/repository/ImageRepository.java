package com.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dev.backend.entity.Image;

public interface ImageRepository extends JpaRepository<Image, Integer> {

    List<Image> findImagesByProductId(Integer productId);

    @Query("""
                SELECT i.urlImage
                FROM Image i
                WHERE i.product.id = :productId
                  AND i.isThumbnail = true
            """)
    Optional<String> findUrlImageIsThumbnailByProductId(Integer productId);
}
