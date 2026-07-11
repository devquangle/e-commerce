package com.dev.backend.dto.voucher;

import java.time.LocalDate;

import com.dev.backend.constant.VoucherStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherRepsonse {
    private Integer id;
    private String name;
    private String code;

    private Integer discountValue;
    private Integer minOrderValue;
    private Integer maxDiscountValue;

    private Integer usageLimit;
    private Integer usedCount;

    private LocalDate startDate;
    private LocalDate endDate;

    private VoucherStatus status;

}
