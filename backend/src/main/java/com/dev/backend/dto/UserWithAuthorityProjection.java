package com.dev.backend.dto;

/**
 * Flattened projection row: user + one role/permission pair (nullable if user has no roles).
 */
public interface UserWithAuthorityProjection {
    Integer getUserId();

    String getFullName();

    String getEmail();

    String getCode();

    String getImage();

    String getRoleName();

    String getPermissionCode();
}

