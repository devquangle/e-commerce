package com.dev.backend.dto;

import java.util.Set;

/**
 * User basic info + resolved roles/permissions (no lazy entity traversal).
 */
public record UserWithAuthoritiesDTO(
        Integer id,
        String fullName,
        String email,
        String code,
        String image,
        Set<String> roles,
        Set<String> permissions
) {
}

