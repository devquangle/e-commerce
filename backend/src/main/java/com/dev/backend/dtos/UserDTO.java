package com.dev.backend.dtos;

import java.util.Set;
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
    private Set<String> roles;
    private Set<String> permissions;

}
