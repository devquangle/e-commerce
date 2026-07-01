package com.dev.backend.dto.promotion;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductPromotionMappingResponse {
    private Integer productId;
    private List<PromotionDetail> promotions;
    
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PromotionDetail {

        private Integer promotionProductId;
        private String name;
        private String campaignType;
        private Integer maxQuantity;
        private Integer discountValue;
        private String startDate;
        private String endDate;
    }
}
