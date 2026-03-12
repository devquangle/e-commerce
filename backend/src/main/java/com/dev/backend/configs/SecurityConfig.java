package com.dev.backend.configs;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;

import com.dev.backend.security.CustomUserDetailsService;
import com.dev.backend.security.jwt.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {
        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(@Lazy JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public BCryptPasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
      

      

        @Bean
        public CustomUserDetailsService customUserDetailsService() {
                return new CustomUserDetailsService();
        }

        @Bean
        public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
                AuthenticationManagerBuilder authenticationManagerBuilder = http
                                .getSharedObject(AuthenticationManagerBuilder.class);

                authenticationManagerBuilder
                                .userDetailsService(customUserDetailsService())
                                .passwordEncoder(passwordEncoder());

                return authenticationManagerBuilder.build();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http.csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(request -> {
                                        CorsConfiguration configuration = new CorsConfiguration();
                                        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
                                        configuration.setAllowedMethods(
                                                        Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                                        configuration.setAllowedHeaders(Arrays.asList("*"));
                                        configuration.setAllowCredentials(true);
                                        return configuration;
                                }))
                                .authorizeHttpRequests(requests -> requests
                                                .requestMatchers("/login", "/comment/**", "/logout", "/register",
                                                                "/api/users/**",
                                                                "/home", "/home/**", "/",
                                                                "/products",
                                                                "/genre/list",
                                                                "/productdetail/**", "/images/**", "/forgotpassword",
                                                                "/updatepassword/**",
                                                                "/shopdetail/**",
                                                                "/payment-online/**",
                                                                "/reviews/**","/forgot/**","/api-ghn/**")
                                                .permitAll()
                                                .requestMatchers("/admin/**").hasAuthority("admin")
                                                .requestMatchers("/user/**").hasAnyAuthority("user", "seller")
                                                .requestMatchers("/seller/**").hasAuthority("seller")
                                                .anyRequest().authenticated())
                                
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public RestTemplate restTemplate() {
                return new RestTemplate();
        }
}
