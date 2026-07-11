package com.dev.backend.dto.voucher;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherFilterRequest {
    private String keyword;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Integer page;
    private Integer size;
}
