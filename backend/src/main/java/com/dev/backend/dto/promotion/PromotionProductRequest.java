package com.dev.backend.dto.promotion;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PromotionProductRequest {
    @NotNull(message = "ID sản phẩm không được để trống")
    @Positive
    private Integer productId;
    @NotNull(message = "Phần trăm giảm giá không được để trống")
    @Min(value = 1, message = "Phần trăm giảm giá phải từ 1%")
    @Max(value = 100, message = "Phần trăm giảm giá không được vượt quá 100%")
    private Integer localDiscount;
    @NotNull(message = "Phần trăm giảm giá không được để trống")
    @Positive(message = "Số lượng phải lớn hơn 0")
    private Integer localQty;

}
