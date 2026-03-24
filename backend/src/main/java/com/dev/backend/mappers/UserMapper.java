package com.dev.backend.mappers;

import org.springframework.stereotype.Component;

import com.dev.backend.dtos.UserDTO;
import com.dev.backend.entities.User;
@Component
public class UserMapper {
    public UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setFullName(user.getFullName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setStreet(user.getStreet());
        userDTO.setCode(user.getCode());
        userDTO.setImage(user.getImage());
        // userDTO.setRoles(user.getUserRoles().stream()
        //         .map(ur -> "ROLE_" + ur.getRole().getName())
        //         .toList());
        // userDTO.setPermissions(user.getUserRoles().stream()
        //         .flatMap(ur -> ur.getRole().getRolePermissions().stream())
        //         .map(rp -> rp.getPermission().getCode())
                // .toList());        

        return userDTO;
    }
}
