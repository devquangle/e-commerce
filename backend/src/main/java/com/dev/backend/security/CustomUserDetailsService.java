package com.dev.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.HashSet;
import java.util.Set;

import com.dev.backend.dto.UserWithAuthoritiesDTO;
import com.dev.backend.entity.User;
import com.dev.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
        private final UserService userService;

        @Override
        public UserDetails loadUserByUsername(String useId) throws UsernameNotFoundException {
                Integer userId = Integer.parseInt(useId);
                UserWithAuthoritiesDTO userWithAuthorities = userService.getUserWithAuthoritiesById(userId);

                Set<SimpleGrantedAuthority> grantedAuthorities = new HashSet<>();
                userWithAuthorities.roles().forEach(role -> grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role)));
                userWithAuthorities.permissions().forEach(code -> grantedAuthorities.add(new SimpleGrantedAuthority(code)));

                // Tạo user "basic" từ projection để tránh 2 query (users + authorities).
                User user = new User();
                user.setId(userWithAuthorities.id());
                user.setFullName(userWithAuthorities.fullName());
                user.setEmail(userWithAuthorities.email());
                user.setCode(userWithAuthorities.code());
                user.setImage(userWithAuthorities.image());

                return new CustomUserDetails(user, grantedAuthorities);
        }
}