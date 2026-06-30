package com.dev.backend.dto.promotion;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PromotionRequest {
    @NotBlank(message = "Tên chương trình không được để trống")
    private String name;

    @NotBlank(message = "Ngày bắt đầu không được để trống")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;

    @NotBlank(message = "Ngày kết thúc không được để trống")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;

    @NotBlank(message = "Loại khuyến mãi không được để trống")
    private String promotionCampaignType;
    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    @Valid
    private List<PromotionProductRequest> promotionProducts;
}
