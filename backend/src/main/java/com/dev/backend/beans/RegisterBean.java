package com.dev.backend.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterBean {
    private String fullName;
    private String phone;
    private String email;
    private String password;
    private String confirmPassword;
}
