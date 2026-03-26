package com.dev.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.dev.backend.entity.User;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    private final String email;
    private final String password;
    private final boolean active;

    private final String fullName;
    private final String phone;
    private final String street;
    private final String image;

    private final Set<GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.email    = user.getEmail();
        this.password = user.getPassword();
        this.active   = user.isActive();

        this.fullName = user.getFullName();
        this.phone    = user.getPhone();
        this.street   = user.getStreet();
        this.image    = user.getImage();
        this.authorities = user.getUserRoles().stream()
            .flatMap(userRole -> {
                var role = userRole.getRole();
                Set<GrantedAuthority> auths = role.getRolePermissions().stream()
                    .map(rp -> (GrantedAuthority) new SimpleGrantedAuthority(rp.getPermission().getCode()))
                    .collect(Collectors.toSet());

                auths.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
                return auths.stream();
            })
            .collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities; 
    }

    @Override public String getPassword()  { return password; }
    @Override public String getUsername()  { return email; }
    @Override public boolean isEnabled()   { return active; }

    // ✅ Expose flat fields — NO User entity reference stored
    public String getFullName() { return fullName; }
    public String getPhone()    { return phone; }
    public String getStreet()   { return street; }
    public String getImage()    { return image; }
    public String getEmail()    { return email; }
}
