package com.dev.backend.dto.address;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)[3|5|7|8|9][0-9]{8}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    private String street;

    @NotNull(message = "Vui lòng chọn tỉnh/thành")
    @Positive(message = "Tỉnh/thành không hợp lệ")
    private Integer provinceId;

    @NotNull(message = "Vui lòng chọn quận/huyện")
    @Positive(message = "Quận/huyện không hợp lệ")
    private Integer districtId;

    @NotBlank(message = "Vui lòng chọn phường/xã")
    private String wardCode;

    @JsonProperty("default")
    private boolean isDefault = false;
}
