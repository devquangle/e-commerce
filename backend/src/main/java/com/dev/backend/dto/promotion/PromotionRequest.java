package com.dev.backend.dto.promotion;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PromotionRequest {
    private String name;
    private String createDate;
    private String endDate;
    private String status;
    private String promotionCampaignType;
    private List<PromotionProduct> promotionProducts;
}
