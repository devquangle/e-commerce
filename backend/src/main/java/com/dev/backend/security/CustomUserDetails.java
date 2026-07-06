package com.dev.backend.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.dev.backend.entity.Role;
import com.dev.backend.entity.User;

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

        if (user.getRoles() == null)
            return;


        for (Role role : user.getRoles()) {
            if (role == null) continue;

            String code = role.getCode();
            // Fallback for old database records that haven't been wiped
            if (code == null || code.trim().isEmpty()) {
                code = role.getName();
            }

            if (code != null && !code.trim().isEmpty()) {
                roles.add(code);
                
                permissions.add(code);
                authorities.add(new SimpleGrantedAuthority(code));
            }
        }
    }

    public CustomUserDetails(User user, Collection<String> roles, Collection<String> permissions) {
        this.user = user;
        this.roles = new HashSet<>(roles);
        this.permissions = new HashSet<>(permissions);
        this.authorities = new HashSet<>();
        
        for (String role : roles) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        }
        for (String perm : permissions) {
            if (perm != null && !perm.trim().isEmpty()) {
                authorities.add(new SimpleGrantedAuthority(perm));
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