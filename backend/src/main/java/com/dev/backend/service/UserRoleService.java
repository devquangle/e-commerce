package com.dev.backend.service;

import com.dev.backend.entity.UserRole;

public interface UserRoleService {
    UserRole save(UserRole userRole);
    boolean isEmpty();
}
