package com.dev.backend.dtos;

import java.util.ArrayList;
import java.util.List;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private String fullName;
    private String email;
    private String phone;
    private String street;
    private String code;
    private String image;
    private List<String> roles = new ArrayList<>();
    private List<String> permissions = new ArrayList<>();

    public UserDTO(String fullName, String email, String phone, String street, String code, String image,
                   String role, String permission) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.street = street;
        this.code = code;
        this.image = image;
        this.roles = role != null ? List.of(role) : List.of();
        this.permissions = permission != null ? List.of(permission) : List.of();
    }

}
