package com.dev.backend.services;


import org.springframework.stereotype.Service;

import com.dev.backend.dtos.UserDTO;
import com.dev.backend.entities.User;
import com.dev.backend.mappers.UserMapper;
import com.dev.backend.repositories.UserRepository;
import com.dev.backend.security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("user "));
    }

    public boolean existsByEmail(String email) {
        return userRepository.checkEmail(email);
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public User getUserLogin(String token) {
        String id = token.replace("Bearer ", "");
        return getUserById(Integer.valueOf(jwtUtil.extractUserId(id)));
    }

    public boolean existsByCode(String code) {
        return userRepository.existsByCode(code);
    }
    public UserDTO getUserDTO(String token) {
        return userMapper.toDTO(getUserLogin(token));
    }

}
