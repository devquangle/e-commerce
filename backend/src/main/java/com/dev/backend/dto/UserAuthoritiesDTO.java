package com.dev.backend.dto;

import java.util.Set;

/**
 * Roles/permissions resolved for a user without requiring lazy entity traversal.
 */
public record UserAuthoritiesDTO(Set<String> roles, Set<String> permissions) {
}

