package com.dev.backend.services;


import org.springframework.stereotype.Service;

import com.dev.backend.dtos.UserDTO;
import com.dev.backend.entities.User;
import com.dev.backend.mappers.UserMapper;
import com.dev.backend.repositories.UserRepository;
import com.dev.backend.security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;
import java.util.List;


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
    public boolean isEmpty(){
        return userRepository.count()==0;
    }

    public boolean existsByEmail(String email) {
        return userRepository.checkEmail(email);
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng"));
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

    public UserDTO getUserDTOById(String authHeader) {
        String token = authHeader.substring(7);
        Integer id=Integer.valueOf(jwtUtil.extractUserId(token));
        User user =getUserById(id);

        // Lấy roles
        List<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getName())
                .distinct()
                .toList();

        // Lấy permissions
        List<String> permissions = user.getUserRoles().stream()
                .flatMap(ur -> ur.getRole().getRolePermissions().stream())
                .map(rp -> rp.getPermission().getCode())
                .distinct()
                .toList();

        UserDTO dto = new UserDTO();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setStreet(user.getStreet());
        dto.setCode(user.getCode());
        dto.setImage(user.getImage());
        dto.setRoles(roles);
        dto.setPermissions(permissions);

        return dto;
    }


    public UserDTO userDTO(String authHeader) {
        String token = authHeader.substring(7);
        Integer id=Integer.valueOf(jwtUtil.extractUserId(token));
        List<UserDTO> rows = userRepository.findUserDTOById(id);
        if (rows.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        UserDTO first = rows.get(0);

        // Gom roles và permissions
        List<String> roles = rows.stream()
                .map(UserDTO::getRoles)
                .flatMap(List::stream)
                .distinct()
                .toList();

        List<String> permissions = rows.stream()
                .map(UserDTO::getPermissions)
                .flatMap(List::stream)
                .distinct()
                .toList();

        first.setRoles(roles);
        first.setPermissions(permissions);

        return first;
    }
}
