package com.dev.backend.mappers;

import org.springframework.stereotype.Component;

import com.dev.backend.dtos.UserDTO;
import com.dev.backend.entities.User;
@Component
public class UserMapper {
    public UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO(user.getFullName(), user.getEmail(), user.getPhone(), user.getStreet(),user.getCode(),
                user.getImage(), 
                user.getUserRoles().stream()
                        .map(ur -> ur.getRole().getName())
                        .toList());
        return userDTO;
    }
}
