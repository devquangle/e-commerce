package com.dev.backend.mapper;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;
import com.dev.backend.security.CustomUserDetails;

@Component
public class UserMapper {
    public UserDTO toDTO(User user, CustomUserDetails userDetails) {
        UserDTO userDTO = new UserDTO();
        userDTO.setFullName(user.getFullName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setStreet(user.getStreet());
        userDTO.setCode(user.getCode());
        userDTO.setImage(user.getImage());
        Set<String> roles = new HashSet<>();
        Set<String> permissions = new HashSet<>();

        userDetails.getAuthorities().forEach(auth -> {
            String authority = auth.getAuthority();
            if (authority.startsWith("ROLE_")) {
                roles.add(authority.substring(5));
            } else {
                permissions.add(authority);
            }
        });
        userDTO.setRoles(roles);
        userDTO.setPermissions(permissions);

        return userDTO;
    }

    public UserDTO toCustomerDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setFullName(user.getFullName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setStreet(user.getStreet());
        userDTO.setCode(user.getCode());
        userDTO.setImage(user.getImage());

        return userDTO;
    }

}
