package com.dev.backend.bean;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JwtBean {
    @NotBlank(message = "Token không được để trống")
    private String token;
}
