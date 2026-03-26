package com.dev.backend.dto;

/**
 * Interface-based projection for a flattened role/permission row.
 * Spring Data will map JPQL aliases (roleName, permissionCode) to these getters.
 */
public interface UserAuthorityProjection {
    String getRoleName();

    String getPermissionCode();
}

