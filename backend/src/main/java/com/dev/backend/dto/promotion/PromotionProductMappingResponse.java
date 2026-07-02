package com.dev.backend.dto.promotion;

import java.time.LocalDate;
import java.util.List;

import com.dev.backend.constant.PromotionCampaignType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PromotionProductMappingResponse {
    private Integer productId;
    private List<PromotionProductDetailResponse> promotions;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PromotionProductDetailResponse {
        private Integer promotionProductId;
        private Integer promotionId;
        private String name;
        private PromotionCampaignType promotionCampaignType;
        private Integer maxQuantity;
        private Integer discountValue;
        private LocalDate startDate;
        private LocalDate expireDate;
    }
}
