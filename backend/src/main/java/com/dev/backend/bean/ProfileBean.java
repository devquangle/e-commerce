package com.dev.backend.bean;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileBean {
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    @NotBlank(message = "Họ tên không được để trống")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Họ tên chỉ được chứa chữ cái và khoảng trắng")
    private String fullName;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Min(value = 10, message = "Số điện thoại phải có ít nhất 10 số")
    private String phone;
    @NotBlank(message = "Địa chỉ không được để trống")
    private String street;
}
