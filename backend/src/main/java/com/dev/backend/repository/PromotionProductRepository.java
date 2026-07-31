package com.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.entity.PromotionProduct;

public interface PromotionProductRepository extends JpaRepository<PromotionProduct, Integer> {

  @Modifying
  @Transactional
  @Query("""
      DELETE FROM PromotionProduct p
      WHERE p.promotion.id = :promotionId
      """)
  void deleteByPromotionId(@Param("promotionId") Integer promotionId);

  @Query("""
      SELECT pp
      FROM PromotionProduct pp
      JOIN FETCH pp.promotion p
      WHERE pp.product.id IN :productIds
        AND p.status = com.dev.backend.constant.BaseStatus.ACTIVE
      """)
  List<PromotionProduct> findPromotionByProductIds(
      @Param("productIds") List<Integer> productIds);

  /**
   * Lấy promotion còn đủ số lượng cho số lượng khách đang mua.
   */
  @Query("""
      SELECT pp
      FROM PromotionProduct pp
      JOIN FETCH pp.promotion p
      WHERE pp.product.id = :productId
        AND p.status = com.dev.backend.constant.BaseStatus.ACTIVE
        AND CURRENT_DATE BETWEEN p.startDate AND p.expireDate
        AND (
              COALESCE(pp.soldQuantity,0)
            + COALESCE(pp.reservedQuantity,0)
            + :quantity
        ) <= pp.maxQuantity
      """)
  PromotionProduct findAvailablePromotion(
      @Param("productId") Integer productId,
      @Param("quantity") Integer quantity);

  @Query("""
          SELECT pp
          FROM PromotionProduct pp
          JOIN FETCH pp.promotion p
          WHERE pp.product.id IN :productIds
            AND p.status = com.dev.backend.constant.BaseStatus.ACTIVE
            AND CURRENT_DATE BETWEEN p.startDate AND p.expireDate
      """)
  List<PromotionProduct> findActivePromotionProducts(
      @Param("productIds") List<Integer> productIds);

  @Query("""
          SELECT pp
          FROM PromotionProduct pp
          JOIN FETCH pp.promotion p
          WHERE pp.product.id = :productId
            AND p.status = com.dev.backend.constant.BaseStatus.ACTIVE
            AND CURRENT_DATE BETWEEN p.startDate AND p.expireDate
      """)
  Optional<PromotionProduct> findActivePromotionByProductId(
      @Param("productId") Integer productId);

  @Query("""
          SELECT pp
          FROM PromotionProduct pp
          JOIN FETCH pp.promotion p
          WHERE pp.product.id IN :productIds
            AND p.status = com.dev.backend.constant.BaseStatus.ACTIVE
            AND CURRENT_DATE BETWEEN p.startDate AND p.expireDate
            AND (
                  COALESCE(pp.soldQuantity,0)
                + COALESCE(pp.reservedQuantity,0)
            ) < pp.maxQuantity
      """)
  List<PromotionProduct> findAvailablePromotions(
      @Param("productIds") List<Integer> productIds);

}