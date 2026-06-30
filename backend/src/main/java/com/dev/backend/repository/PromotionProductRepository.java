package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.entity.PromotionProduct;


public interface PromotionProductRepository extends JpaRepository<PromotionProduct,Integer>{

    @Modifying
    @Transactional
    @Query("DELETE FROM PromotionProduct p WHERE p.promotion.id = :promotionId")
    void deleteByPromotionId(Integer promotionId);
}
