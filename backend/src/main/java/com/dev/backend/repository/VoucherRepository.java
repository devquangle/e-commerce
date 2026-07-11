package com.dev.backend.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.constant.VoucherStatus;
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

}
