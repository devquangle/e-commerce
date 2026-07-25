package com.dev.backend.dto.voucher;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherUserRepsonse {
    private Integer id;
    private String name;
    private String code;

    private Integer discountValue;
    private Integer minOrderValue;
    private Integer maxDiscountValue;


    private Integer userUsedCount;
    private Integer usageLimitPerUser;

    private LocalDate startDate;
    private LocalDate endDate;


}
