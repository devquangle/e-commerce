package com.dev.backend.security.jwt;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dev.backend.constant.JwtType;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            if (jwtUtil.isValid(token, JwtType.ACCESS) &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                Integer userId = Integer.valueOf(jwtUtil.extractUserId(token));
                var roles = jwtUtil.extractRoles(token);
                var permissions = jwtUtil.extractPermissions(token);

                Set<SimpleGrantedAuthority> authorities = new HashSet<>();

                if (roles != null) {
                    roles.forEach(r ->
                            authorities.add(new SimpleGrantedAuthority("ROLE_" + r))
                    );
                }

                if (permissions != null) {
                    permissions.forEach(p ->
                            authorities.add(new SimpleGrantedAuthority(p))
                    );
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                authorities
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception e) {
            log.debug("Invalid JWT: {}", e.getMessage());
        }

        chain.doFilter(request, response);
    }
}