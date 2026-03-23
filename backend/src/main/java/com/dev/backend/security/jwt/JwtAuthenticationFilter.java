package com.dev.backend.security.jwt;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dev.backend.entities.User;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.security.CustomUserDetailsService;
import com.dev.backend.services.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

        private final JwtUtil jwtUtil;
        private final CustomUserDetailsService userDetailsService;
        private final ObjectMapper objectMapper;
        private final UserService userService;



        @Override
        protected void doFilterInternal( HttpServletRequest request,  HttpServletResponse response,
                     FilterChain chain) throws ServletException, IOException {
                String authHeader = request.getHeader("Authorization");

                // 1. Nếu không có token → bỏ qua
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        chain.doFilter(request, response);
                        return;
                }

                String token = authHeader.substring(7);
                try {

                        User user=userService.getUserLogin(token);

                        // 2. Validate token trước
                        if (!jwtUtil.validateToken(token,user.getId(),"LOGIN")) {
                                throw new RuntimeException("Invalid token");
                        }

                        // 3. Extract thông tin từ token (KHÔNG query DB)
                        String email =user.getEmail();

                        // 4. Nếu chưa authenticate thì mới set
                        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                                // 5. Tạo authentication
                                UsernamePasswordAuthenticationToken authentication =
                                        new UsernamePasswordAuthenticationToken(
                                                userDetails,
                                                null,
                                                userDetails.getAuthorities()
                                        );

                                authentication.setDetails(
                                        new WebAuthenticationDetailsSource().buildDetails(request)
                                );

                                SecurityContextHolder.getContext().setAuthentication(authentication);
                        }

                } catch (Exception e) {
                        // 6. Trả về 401 nếu lỗi
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
