package com.dev.backend.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.dev.backend.dto.UserAuthorityProjection;
import com.dev.backend.dto.UserAuthoritiesDTO;
import com.dev.backend.dto.UserWithAuthorityProjection;
import com.dev.backend.dto.UserWithAuthoritiesDTO;
import com.dev.backend.entity.User;
import com.dev.backend.repository.UserRepository;
import com.dev.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findBasicByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    @Override
    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    @Override
    public boolean isEmpty() {
        return userRepository.count() == 0;
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Object userDTO(String token) {
        return null;
    }

    @Override
    public boolean existsByCode(String code) {
        return userRepository.existsByCode(code);
    }

    @Override
    public User getUserDetailById(Integer id) {
        return userRepository.findBasicById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    @Override
    public UserAuthoritiesDTO getUserAuthoritiesById(Integer id) {
        List<UserAuthorityProjection> rows = userRepository.findAuthorityProjectionByUserId(id);
        return toAuthorities(rows);
    }

    @Override
    public UserAuthoritiesDTO getUserAuthoritiesByEmail(String email) {
        List<UserAuthorityProjection> rows = userRepository.findAuthorityProjectionByEmail(email);
        return toAuthorities(rows);
    }

    @Override
    public UserWithAuthoritiesDTO getUserWithAuthoritiesById(Integer id) {
        List<UserWithAuthorityProjection> rows = userRepository.findUserWithAuthoritiesProjectionById(id);
        return toUserWithAuthorities(rows);
    }

    private UserAuthoritiesDTO toAuthorities(List<UserAuthorityProjection> rows) {
        Set<String> roles = new HashSet<>();
        Set<String> permissions = new HashSet<>();

        for (UserAuthorityProjection row : rows) {
            if (row == null) continue;
            String roleName = row.getRoleName();
            if (roleName != null) roles.add(roleName);

            String permissionCode = row.getPermissionCode();
            if (permissionCode != null) permissions.add(permissionCode);
        }

        // Defensive non-null guarantee for callers
        return new UserAuthoritiesDTO(
                Objects.requireNonNullElse(roles, Set.of()),
                Objects.requireNonNullElse(permissions, Set.of())
        );
    }

    private UserWithAuthoritiesDTO toUserWithAuthorities(List<UserWithAuthorityProjection> rows) {
        Set<String> roles = new HashSet<>();
        Set<String> permissions = new HashSet<>();

        Integer userId = null;
        String fullName = null;
        String email = null;
        String code = null;
        String image = null;

        for (UserWithAuthorityProjection row : rows) {
            if (row == null) continue;

            if (userId == null) userId = row.getUserId();
            if (fullName == null) fullName = row.getFullName();
            if (email == null) email = row.getEmail();
            if (code == null) code = row.getCode();
            if (image == null) image = row.getImage();

            String roleName = row.getRoleName();
            if (roleName != null) roles.add(roleName);

            String permissionCode = row.getPermissionCode();
            if (permissionCode != null) permissions.add(permissionCode);
        }

        if (userId == null) {
            throw new IllegalArgumentException("User not found");
        }

        return new UserWithAuthoritiesDTO(
                userId,
                fullName,
                email,
                code,
                image,
                roles,
                permissions
        );
    }

}