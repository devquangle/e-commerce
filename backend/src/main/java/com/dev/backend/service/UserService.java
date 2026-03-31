package com.dev.backend.service;

import com.dev.backend.entity.User;

public interface UserService {

    Object userDTO(String token);

    User saveUser(User user);

    User getUserByEmail(String email);

    User getUserById(Integer id);

    User getUserByToken(String token);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByCode(String code);

    boolean isEmpty();

    void processLoginFail(Integer id);

    void resetFailedAttempts(Integer id);

}