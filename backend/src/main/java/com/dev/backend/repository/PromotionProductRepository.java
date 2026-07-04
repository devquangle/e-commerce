package com.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.entity.PromotionProduct;

public interface PromotionProductRepository extends JpaRepository<PromotionProduct, Integer> {

    @Modifying
    @Transactional
    @Query("DELETE FROM PromotionProduct p WHERE p.promotion.id = :promotionId")
    void deleteByPromotionId(Integer promotionId);

    @Query("""
                SELECT pp
                FROM PromotionProduct pp
                JOIN FETCH pp.promotion p
                WHERE pp.product.id IN :productIds
                  AND p.status = com.dev.backend.constant.BaseStatus.ACTIVE
            """)
    List<PromotionProduct> findPromotionByProductIds(List<Integer> productIds);

    @Query("""
                SELECT pp.discountValue
                FROM PromotionProduct pp
                WHERE pp.product.id = :productId
                  AND pp.promotion.status = com.dev.backend.constant.BaseStatus.ACTIVE
                  AND CURRENT_DATE BETWEEN pp.promotion.startDate AND pp.promotion.expireDate
                  AND pp.soldQuantity < pp.maxQuantity
            """)
    Integer findDiscountValueByProductId(@Param("productId") Integer productId);
}
