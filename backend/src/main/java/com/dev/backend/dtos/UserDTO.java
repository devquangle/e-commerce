package com.dev.backend.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class UserDTO {
    private String fullName;
    private String email;
    private String phone;
    private String street;
    private String image;
    private List<String> roles;

}
