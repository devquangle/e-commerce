package com.dev.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.dev.backend.entity.User;
import com.dev.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
        private final AuthService authService;

        @Override
        public UserDetails loadUserByUsername(String useId) throws UsernameNotFoundException {
                Integer userId = Integer.parseInt(useId);
                User user = authService.getUserById(userId);
                return new CustomUserDetails(user);
        }
}