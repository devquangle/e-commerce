package com.dev.backend.security.jwt;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dev.backend.resp.ResponseData;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // 1. Không có token → bỏ qua
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String userId = jwtUtil.extractUserId(token);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 2. Validate token
                if (!jwtUtil.validateAccessToken(token)) {
                    throw new RuntimeException("Invalid token");
                }

                // 3. Lấy roles + permissions từ token
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();

                authorities.addAll(
                        jwtUtil.extractRoles(token)
                                .stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                                .toList()
                );

                authorities.addAll(
                        jwtUtil.extractPermissions(token)
                                .stream()
                                .map(SimpleGrantedAuthority::new)
                                .toList()
                );

                // 4. Set Authentication (KHÔNG DB)
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
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");

            response.getWriter().write(
                    objectMapper.writeValueAsString(
                            new ResponseData(false,
                                    "Token không hợp lệ hoặc hết hạn",
                                    null,
                                    LocalDateTime.now())
                    )
            );
            return;
        }

        chain.doFilter(request, response);
    }
}