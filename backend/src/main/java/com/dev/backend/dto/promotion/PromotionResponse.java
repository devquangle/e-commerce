package com.dev.backend.dto.promotion;

import com.dev.backend.constant.BaseStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PromotionResponse {
    private Integer id;
    private String name;
    private Integer discountValue;
    private String startDate;
    private String endDate;
    private BaseStatus status;
}
