package com.dev.backend.mapper;

import org.springframework.stereotype.Component;
import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;
import com.dev.backend.security.CustomUserDetails;

@Component
public class UserMapper {
    public UserDTO toDTO(CustomUserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }

        User user = userDetails.getUser();
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .street(user.getStreet())
                .code(user.getCode())
                .image(user.getImage())
                .roles(userDetails.getRoles())
                .permissions(userDetails.getPermissions())
                .build();
    }

    

}
