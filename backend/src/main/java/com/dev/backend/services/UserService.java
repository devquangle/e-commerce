package com.dev.backend.services;

import com.dev.backend.entities.User;

public interface UserService {

    Object userDTO(String token);

    User saveUser(User user);

    User getUserByEmail(String email);

    User getUserById(Integer id);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByCode(String code);

    boolean isEmpty();

}