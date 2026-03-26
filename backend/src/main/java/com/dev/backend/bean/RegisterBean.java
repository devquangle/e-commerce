package com.dev.backend.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterBean {
    private String fullName;
    private String email;
    private String password;
    private String confirmPassword;
}
