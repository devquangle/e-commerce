package com.dev.backend.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.dev.backend.entity.Permission;
import com.dev.backend.entity.Role;
import com.dev.backend.entity.RolePermission;
import com.dev.backend.entity.User;
import com.dev.backend.entity.UserRole;

import java.util.*;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    @Getter
    private final User user;
    private final Set<GrantedAuthority> authorities;
    @Getter
    private final Set<String> roles;
    @Getter
    private final Set<String> permissions;

    public CustomUserDetails(User user) {
        this.user = user;

        // 🔹 roles
        this.roles = user.getUserRoles().stream()
                .map(UserRole::getRole)
                .filter(Objects::nonNull)
                .map(Role::getName)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 🔹 permissions
        this.permissions = user.getUserRoles().stream()
                .map(UserRole::getRole)
                .filter(Objects::nonNull)
                .flatMap(role -> Optional.ofNullable(role.getRolePermissions())
                        .orElse(Collections.emptySet())
                        .stream())
                .map(RolePermission::getPermission)
                .filter(Objects::nonNull)
                .map(Permission::getCode)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 🔹 authorities
        this.authorities = new HashSet<>();

        roles.forEach(r -> authorities.add(new SimpleGrantedAuthority("ROLE_" + r)));

        permissions.forEach(p -> authorities.add(new SimpleGrantedAuthority(p)));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isEnabled();
    }
}