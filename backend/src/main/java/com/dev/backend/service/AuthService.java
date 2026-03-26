package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.UserRP;

public interface AuthService {

    List<UserRP> getUserRPById(Integer id);

    List<UserRP> getUserRPByEmail(String email);
}