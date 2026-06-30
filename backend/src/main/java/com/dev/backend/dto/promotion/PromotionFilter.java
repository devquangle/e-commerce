package com.dev.backend.dto.promotion;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromotionFilter {

    private String keyword;

    private LocalDate startDate;

    private LocalDate endDate;

    private String promotionCampaignType;

    private String status;

    private Integer page = 0;

    private Integer size = 10;
}