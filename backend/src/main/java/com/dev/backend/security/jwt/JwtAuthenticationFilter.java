package com.dev.backend.security.jwt;

import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dev.backend.constant.JwtType;
import com.dev.backend.entity.User;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.service.AuthService;

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
    private final AuthService authService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            if (jwtUtil.isValid(token, JwtType.ACCESS) &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                int userId = jwtUtil.extractUserId(token);
                User user = authService.getUserById(userId);
             
                if (!jwtUtil.isTokenVersionValid(token, user.getTokenVersion())) {
                    chain.doFilter(request, response);
                    return;
                }

                CustomUserDetails userDetails = new CustomUserDetails(user);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception e) {
            log.debug("Invalid JWT: {}", e.getMessage());
        }

        chain.doFilter(request, response);
    }
}