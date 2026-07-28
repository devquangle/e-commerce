package com.dev.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CancelOrderRequest {
    @NotBlank(message = "Mã đơn không được bỏ trống")
    private String orderCode;
    @NotBlank(message = "Lý do huỷ không được bỏ trống")
    private String cancel;
}
