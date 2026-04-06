package com.dev.backend.dto;

import java.time.LocalDateTime;

public record UserRP(
    Integer id,
    int tokenVersion,
    String fullName,
    String email,
    String password,
    String phone,
    String code,
    String street,
    String image,
    LocalDateTime createAt,
    LocalDateTime updateAt,
    boolean enabled,
    boolean accountNonLocked,
    int failedAttempt,
    LocalDateTime lockTime,
    String roleName,
    String permissionCode
) {}