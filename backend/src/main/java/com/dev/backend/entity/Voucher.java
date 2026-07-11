package com.dev.backend.entity;

import java.time.LocalDate;

import com.dev.backend.constant.VoucherStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Voucher extends BaseAuditableEntity<Integer> {
    private String name;
    private String code;

    private Integer discountValue;
    private Integer minOrderValue;
    private Integer maxDiscountValue;

    private Integer usageLimit;
    private Integer usedCount;
    private Integer usageLimitPerUser;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoucherStatus status;
}
