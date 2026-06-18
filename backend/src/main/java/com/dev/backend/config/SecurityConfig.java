package com.dev.backend.config;

import com.dev.backend.security.CustomAccessDeniedHandler;
import com.dev.backend.security.CustomAuthenticationEntryPoint;
import com.dev.backend.security.CustomUserDetailsService;
import com.dev.backend.security.jwt.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CustomAccessDeniedHandler customAccessDeniedHandler;
        private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
        private final CustomUserDetailsService customUserDetailsService;

        public static final String[] PUBLIC_URLS = {
                        "/login",
                        "/logout",
                        "/register",
                        "/refresh-token",
                        "/resend-verify-register",
                        "/verify-register",
                        "/api/v1/auth/**",
                        "/home/**",
                        "/images/**",
                        "/public/**"
        };

        public static final String[] PUBLIC_GET_URLS = {
                        "/products",
                        "/genre/list",
                        "/productdetail/**",
                        "/reviews/**",
                        "/api/v1/products/**",
                        "/api/v1/genres/**",
                        "/api/v1/authors/**",
                        "/api/v1/publishers/**",
                        "/api/v1/reviews/**"
        };

        // ================= AUTH MANAGER =================
        @Bean
        public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
                AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);

                builder
                                .userDetailsService(customUserDetailsService)
                                .passwordEncoder(passwordEncoder());

                return builder.build();
        }

        // ================= SECURITY FILTER CHAIN =================
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())
                                .cors(Customizer.withDefaults())

                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(req -> req
                                                .requestMatchers(PUBLIC_URLS).permitAll()
                                                .requestMatchers(HttpMethod.GET, PUBLIC_GET_URLS).permitAll()
                                                .anyRequest().authenticated())

                                .exceptionHandling(ex -> ex
                                                .accessDeniedHandler(customAccessDeniedHandler)
                                                .authenticationEntryPoint(customAuthenticationEntryPoint))

                                .logout(logout -> logout.disable())

                                .addFilterBefore(jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // ================= CORS CONFIG =================
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(List.of(
                                "http://localhost:5173"));

                config.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS"));

                config.setAllowedHeaders(List.of(
                                "Authorization",
                                "Content-Type",
                                "Accept"));

                config.setExposedHeaders(List.of(
                                "Authorization"));

                config.setAllowCredentials(true);
                config.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", config);

                return source;
        }

        // ================= PASSWORD =================
        @Bean
        public BCryptPasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public RestTemplate restTemplate() {
                return new RestTemplate();
        }

        @Bean
        public MultipartResolver multipartResolver() {
                return new StandardServletMultipartResolver();
        }

        @Bean
        public ObjectMapper objectMapper() {
                return new ObjectMapper();
        }
}