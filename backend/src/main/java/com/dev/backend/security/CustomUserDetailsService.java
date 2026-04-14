package com.dev.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.dev.backend.entity.User;
import com.dev.backend.repository.AuthRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
      private final AuthRepository authRepository;

      @Override
      public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
            User user = authRepository.findByEmail(email)
                  .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
            return new CustomUserDetails(user);
      }

}