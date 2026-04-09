package com.dev.backend.mapper;

import java.util.Collections;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.Permission;
import com.dev.backend.entity.Role;
import com.dev.backend.entity.RolePermission;
import com.dev.backend.entity.User;
import com.dev.backend.entity.UserRole;
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

    public UserDTO toProfile(User user) {
        if (user == null) {
            return null;
        }

        Set<String> roles = user.getUserRoles().stream()
                .map(UserRole::getRole)
                .filter(Objects::nonNull)
                .map(Role::getName)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<String> permissions = user.getUserRoles().stream()
                .map(UserRole::getRole)
                .filter(Objects::nonNull)
                .flatMap(role -> Optional.ofNullable(role.getRolePermissions())
                        .orElse(Collections.emptySet())
                        .stream())
                .map(RolePermission::getPermission)
                .filter(Objects::nonNull)
                .map(Permission::getCode)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
       
        UserDTO userDTO = new UserDTO();
        userDTO.setFullName(user.getFullName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setStreet(user.getStreet());
        userDTO.setCode(user.getCode());
        userDTO.setImage(user.getImage());
        userDTO.setRoles(roles);
        userDTO.setPermissions(permissions);

        return userDTO;
    }

}
