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

        this.roles = new HashSet<>();
        this.permissions = new HashSet<>();
        this.authorities = new HashSet<>();

        if (user.getUserRoles() == null)
            return;

        for (UserRole ur : user.getUserRoles()) {
            Role role = ur.getRole();
            if (role == null)
                continue;

            String roleName = role.getName();
            if (roleName != null) {
                roles.add(roleName);
                authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName));
            }

            if (role.getRolePermissions() == null)
                continue;

            for (RolePermission rp : role.getRolePermissions()) {
                Permission p = rp.getPermission();
                if (p == null)
                    continue;

                String code = p.getCode();
                if (code != null) {
                    permissions.add(code);
                    authorities.add(new SimpleGrantedAuthority(code));
                }
            }
        }
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