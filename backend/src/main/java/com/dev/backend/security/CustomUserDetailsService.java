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
      public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
            User user = authService.getUserByEmail(email);
            return new CustomUserDetails(user);
      }

}