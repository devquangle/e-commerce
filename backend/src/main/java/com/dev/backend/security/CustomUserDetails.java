package com.dev.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.dev.backend.entity.Permission;
import com.dev.backend.entity.Role;
import com.dev.backend.entity.User;
import java.util.*;

public class CustomUserDetails implements UserDetails {

    private final User user;
    private final Set<String> roles;
    private final Set<String> permissions;
    private final Set<GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.user = user;

        // 1️⃣ Tách roles và permissions
        Set<String> roleSet = new HashSet<>();
        Set<String> permSet = new HashSet<>();
        Set<GrantedAuthority> authoritySet = new HashSet<>();

        if (user.getUserRoles() != null) {
            user.getUserRoles().forEach(userRole -> {
                Role role = userRole.getRole();
                if (role != null) {
                    // Role authority
                    String roleName = role.getName();
                    if (roleName != null) {
                        roleSet.add(roleName);
                        authoritySet.add(new SimpleGrantedAuthority("ROLE_" + roleName));
                    }

                    // Permissions
                    if (role.getRolePermissions() != null) {
                        role.getRolePermissions().forEach(rp -> {
                            Permission perm = rp.getPermission();
                            if (perm != null && perm.getCode() != null) {
                                permSet.add(perm.getCode());
                                authoritySet.add(new SimpleGrantedAuthority(perm.getCode()));
                            }
                        });
                    }
                }
            });
        }

        this.roles = Collections.unmodifiableSet(roleSet);
        this.permissions = Collections.unmodifiableSet(permSet);
        this.authorities = Collections.unmodifiableSet(authoritySet);
    }

    public Set<String> getRoles() {
        return roles;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    public User getUser() {
        return user;
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