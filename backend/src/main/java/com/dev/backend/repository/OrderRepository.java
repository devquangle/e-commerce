package com.dev.backend.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.constant.OrderStatus;
import com.dev.backend.entity.Order;
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("""
            SELECT o
            FROM Order o
            WHERE o.user.id = :userId
            AND (
                    :keyword IS NULL
                    OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR o.phone LIKE CONCAT('%', :keyword, '%')
              )
            AND (:startDate IS NULL OR o.createdAt >= :startDate)
            AND (:endDate IS NULL OR o.createdAt <= :endDate)
            AND (:status IS NULL OR o.status = :status)
            """)
    Page<Order> searchOrderUser(
            @Param("userId") Integer userId,
            @Param("keyword") String keyword,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") OrderStatus status,
            Pageable pageable);

    @Query("""
            SELECT o
            FROM Order o
            WHERE (
                    :keyword IS NULL
                    OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR o.phone LIKE CONCAT('%', :keyword, '%')
            )
            AND (:startDate IS NULL OR o.createdAt >= :startDate)
            AND (:endDate IS NULL OR o.createdAt <= :endDate)
            AND (:status IS NULL OR o.status = :status)
            ORDER BY o.createdAt DESC
            """)
    Page<Order> searchOrder(
            @Param("keyword") String keyword,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") OrderStatus status,
            Pageable pageable);
}
