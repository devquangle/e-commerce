package com.dev.backend.service.impl;

import org.springframework.stereotype.Service;

import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.UserMapper;
import com.dev.backend.repository.AuthRepository;
import com.dev.backend.service.AuthService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthRepository authRepository;
    private final UserMapper userMapper;

    @Override
    public User getUserById(Integer id) {
        return authRepository.findById(id).orElseThrow(() -> new NotFoundException("User NOT_FOUND"));
    }

    @Override
    public User getUserByEmail(String email) {
        return authRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User NOT_FOUND"));
    }

    @Override
    public UserDTO toDTO(Integer id) {
        User user = getUserById(id);
        return userMapper.toProfile(user);
    }

}