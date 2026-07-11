package com.dev.backend.dto;

import java.time.LocalDate;

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
    LocalDate createAt,
    LocalDate updateAt,
    boolean enabled,
    boolean accountNonLocked,
    int failedAttempt,
    LocalDate lockTime,
    String roleName,
    String permissionCode
) {}