package com.dev.backend.service;

import com.dev.backend.dto.UserAuthoritiesDTO;
import com.dev.backend.entity.User;
import com.dev.backend.dto.UserWithAuthoritiesDTO;

public interface UserService {

    Object userDTO(String token);

    User saveUser(User user);

    User getUserByEmail(String email);

    User getUserById(Integer id);

    User getUserDetailById(Integer id);

    UserAuthoritiesDTO getUserAuthoritiesById(Integer id);

    UserAuthoritiesDTO getUserAuthoritiesByEmail(String email);

    UserWithAuthoritiesDTO getUserWithAuthoritiesById(Integer id);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByCode(String code);

    boolean isEmpty();

}