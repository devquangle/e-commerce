package com.dev.backend.service;


import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;

public interface AuthService {


    User getUserById(Integer id);

    User getUserByEmail(String email);

    UserDTO toDTO(Integer id);


}