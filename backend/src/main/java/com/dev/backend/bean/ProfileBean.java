package com.dev.backend.bean;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ProfileBean {
    private String email;
    private String fullName;
    private String phone;
    private String street;
    private MultipartFile image;
}
