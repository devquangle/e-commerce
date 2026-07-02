package com.dev.backend.repository;

import java.time.LocalDate;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.constant.PromotionCampaignType;
import com.dev.backend.entity.Promotion;

public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
  @Query("""
      SELECT p
      FROM Promotion p
      WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        AND (:status IS NULL OR p.status = :status)
        AND (:promotionCampaignType IS NULL
             OR p.promotionCampaignType = :promotionCampaignType)
        AND (:startDate IS NULL OR p.startDate >= :startDate)
        AND (:endDate IS NULL OR p.expireDate <= :endDate)
      """)
  Page<Promotion> searchPromotions(
      @Param("keyword") String keyword,
      @Param("startDate") LocalDate startDate,
      @Param("endDate") LocalDate endDate,
      @Param("promotionCampaignType") PromotionCampaignType promotionCampaignType,
      @Param("status") BaseStatus status,
      Pageable pageable);

  @EntityGraph(attributePaths = "promotionProducts")
  @Query("""
      SELECT p
      FROM Promotion p
      WHERE p.id = :id
      """)
  Optional<Promotion> findByIdWithPromotionProducts(@Param("id") Integer id);


}
