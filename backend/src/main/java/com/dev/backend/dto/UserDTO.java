package com.dev.backend.dto;

import java.util.Set;
import lombok.*;
@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class UserDTO {
    private String fullName;
    private String email;
    private String phone;
    private String street;
    private String code;
    private String image;
    private Set<String> roles;
    private Set<String> permissions;

}
