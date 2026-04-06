package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.UserRP;
import com.dev.backend.entity.User;

public interface AuthService {

    List<UserRP> getUserRPById(Integer id);

    List<UserRP> getUserRPByEmail(String email);

    User getUserById(Integer id);

    User getUserByEmail(String email);

}