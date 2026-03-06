package com.dev.backend.security;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dev.backend.entities.User;
import com.dev.backend.services.UserService;

@Service
public class CustomUserDetailsService implements UserDetailsService {
        @Autowired
        private UserService userService;

        @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
                User user = userService.findUserByEmail(email);

                if (user == null) {
                        throw new UsernameNotFoundException("User not found");
                }

                List<String> roles = user.getUserRoles()
                                .stream()
                                .map(ur -> ur.getRole().getName())
                                .toList();

                Set<GrantedAuthority> authorities = roles.stream()
                                .map(role -> new SimpleGrantedAuthority(role))
                                .collect(Collectors.toSet());

                return new org.springframework.security.core.userdetails.User(
                                user.getEmail(),
                                user.getPassword(),
                                authorities);
        }
}