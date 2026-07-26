package com.dev.backend.dto.order;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderFilterRequest {
    private String keyword;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Integer page;
    private Integer size;
}
