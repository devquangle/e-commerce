package com.dev.backend.dto.product;

import com.dev.backend.constant.PromotionCampaignType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromotionResponse {

    private Integer value;
    private PromotionCampaignType type;
}