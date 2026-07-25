package com.dev.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.constant.VoucherStatus;
import com.dev.backend.dto.voucher.VoucherUserRepsonse;
import com.dev.backend.entity.Voucher;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {

    @Query("""
            SELECT v
            FROM Voucher v
            WHERE (
                :keyword IS NULL
                OR LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(v.code) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            AND (:status IS NULL OR v.status = :status)
            AND (:startDate IS NULL OR v.startDate >= :startDate)
            AND (:endDate IS NULL OR v.endDate <= :endDate)
            """)
    Page<Voucher> search(
            @Param("keyword") String keyword,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") VoucherStatus status,
            Pageable pageable);

    @Query("""
                SELECT new com.dev.backend.dto.voucher.VoucherUserRepsonse(
                    v.id,
                    v.name,
                    v.code,
                    v.discountValue,
                    v.minOrderValue,
                    v.maxDiscountValue,
                    CAST(COUNT(o) AS integer),
                    v.usageLimitPerUser,
                    v.startDate,
                    v.endDate
                )
                FROM Voucher v
                LEFT JOIN v.orders o ON o.user.id = :userId
                                     AND o.status NOT IN (com.dev.backend.constant.OrderStatus.CANCELLED)
                WHERE v.status = com.dev.backend.constant.VoucherStatus.ACTIVE
                  AND CURRENT_DATE BETWEEN v.startDate AND v.endDate
                  AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit)
                  AND (:code IS NULL OR :code = '' OR v.code = :code)
                GROUP BY v.id, v.name, v.code, v.discountValue, v.minOrderValue,
                         v.maxDiscountValue, v.usageLimitPerUser, v.startDate, v.endDate
                HAVING v.usageLimitPerUser IS NULL OR COUNT(o) < v.usageLimitPerUser
            """)
    List<VoucherUserRepsonse> findAvailableVouchersForUser(
            @Param("userId") Integer userId,  @Param("code") String code );
}