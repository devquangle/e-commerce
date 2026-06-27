package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.entity.Promotion;

public interface PromotionRepository  extends JpaRepository<Promotion,Integer>{
    
}
