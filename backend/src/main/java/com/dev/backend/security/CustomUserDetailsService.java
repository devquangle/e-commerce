package com.dev.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.dev.backend.entity.User;
import com.dev.backend.repository.AuthRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
      private final AuthRepository authRepository;

      @Override
      @Transactional(readOnly = true)
      public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
            User user = authRepository.findByEmail(email)
                  .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
            return new CustomUserDetails(user);
      }

      @Transactional(readOnly = true)
      public CustomUserDetails loadUserById(Integer id) {
            User user = authRepository.findById(id).orElse(null);
            if (user == null) return null;
            return new CustomUserDetails(user);
      }

}