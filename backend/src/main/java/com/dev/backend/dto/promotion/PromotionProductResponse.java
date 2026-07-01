package com.dev.backend.dto.promotion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PromotionProductResponse {

    private Integer productId;
    private Integer localDiscount;
    private Integer localQty;
}
