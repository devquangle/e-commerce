package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.backend.entity.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer> {

}
