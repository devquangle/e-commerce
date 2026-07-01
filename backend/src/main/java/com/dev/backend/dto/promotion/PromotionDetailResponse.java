package com.dev.backend.dto.promotion;

import java.util.List;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.constant.PromotionCampaignType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PromotionDetailResponse {
    private Integer id;
    private String name;
    private String startDate;
    private String endDate;
    private BaseStatus status;
    private PromotionCampaignType promotionCampaignType;
    private List<PromotionProductResponse> promotionProducts;
}
