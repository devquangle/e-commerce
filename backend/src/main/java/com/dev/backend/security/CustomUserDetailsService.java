package com.dev.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.dev.backend.dto.UserRP;
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
                List<UserRP> userRPs = authService.getUserRPById(userId);
                UserRP userRP = userRPs.getFirst();
                Set<SimpleGrantedAuthority> grantedAuthorities = userRPs.stream()
                                .flatMap(rp -> {
                                        Stream<SimpleGrantedAuthority> roleStream = rp.roleName() != null
                                                        ? Stream.of(new SimpleGrantedAuthority("ROLE_" + rp.roleName()))
                                                        : Stream.empty();
                                        Stream<SimpleGrantedAuthority> permStream = rp.permissionCode() != null
                                                        ? Stream.of(new SimpleGrantedAuthority(rp.permissionCode()))
                                                        : Stream.empty();
                                        return Stream.concat(roleStream, permStream);
                                })
                                .collect(Collectors.toSet());
                User user = new User();
                user.setId(userRP.id());
                user.setFullName(userRP.fullName());
                user.setEmail(userRP.email());
                user.setCode(userRP.code());
                user.setStreet(userRP.street());
                user.setImage(userRP.image());
                return new CustomUserDetails(user, grantedAuthorities);
        }
}