package com.dev.backend.mapper;

import java.util.HashSet;
import java.util.Set;

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

        Set<String> roles = new HashSet<>();
        Set<String> permissions = new HashSet<>();

        for (UserRole ur : user.getUserRoles()) {
            Role role = ur.getRole();
            if (role == null)
                continue;

            roles.add(role.getName());

            if (role.getRolePermissions() != null) {
                for (RolePermission rp : role.getRolePermissions()) {
                    Permission p = rp.getPermission();
                    if (p != null) {
                        permissions.add(p.getCode());
                    }
                }
            }
        }

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
