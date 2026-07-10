package com.dev.backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
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

    private LocalDate startDate;
    private LocalDate endDate;
}
