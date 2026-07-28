package com.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    @Query("""
                SELECT COALESCE(SUM(oi.quantity), 0)
                FROM OrderItem oi
                WHERE oi.product.id = :productId
                  AND oi.order.status = :status
            """)
    Long getSoldCountByProductId(@Param("productId") Integer productId,
            @Param("status") com.dev.backend.constant.OrderStatus status);

    @Query("""
                SELECT oi
                FROM OrderItem oi
                WHERE oi.order.orderCode = :orderCode
            """)
    List<OrderItem> findByOrderCode(
            @Param("orderCode") String orderCode);
}
