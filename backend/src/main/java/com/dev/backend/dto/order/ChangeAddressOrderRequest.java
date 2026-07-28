package com.dev.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeAddressOrderRequest {
    @NotBlank(message = "Mã đơn không được bỏ trống")
    private String orderCode;
    @NotNull(message = "Địa chỉ không được bỏ trống")
    private Integer addressId;
}
