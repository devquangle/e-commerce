package com.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.entity.Image;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    
    List<Image> findByProductId(Integer productId);
}
