package com.dev.backend.security.jwt;

import java.util.Base64;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dev.backend.constant.JwtType;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey));
    }

    // ================= GENERATE =================

    public String generateToken(int userId, JwtType type) {
        return buildToken(userId, null, null, type);
    }

    public String generateAccessToken(int userId, List<String> roles, List<String> permissions) {
        return buildToken(userId, roles, permissions, JwtType.ACCESS);
    }

    public String generateRefreshToken(int userId){
        return buildToken(userId, null, null, JwtType.REFRESH);
    }

    public String generateVerifyToken(int userId) {
        return buildToken(userId, null, null, JwtType.VERIFY_EMAIL);
    }

    public String generateResetPasswordToken(int userId) {
        return buildToken(userId, null, null, JwtType.RESET_PASSWORD);
    }

    private String buildToken(int userId,
                              List<String> roles,
                              List<String> permissions,
                              JwtType type) {

        JwtBuilder builder = Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("type", type.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + type.getExpirationMillis()))
                .signWith(signingKey(), SignatureAlgorithm.HS256);

        if (roles != null) builder.claim("roles", roles);
        if (permissions != null) builder.claim("permissions", permissions);

        return builder.compact();
    }

    // ================= PARSE =================

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    public JwtType extractType(String token) {
        String type = extractAllClaims(token).get("type", String.class);
        return JwtType.valueOf(type);
    }

    public List<String> extractRoles(String token) {
        List<?> roles = extractAllClaims(token).get("roles", List.class);
        return roles == null ? List.of() : roles.stream().map(Object::toString).toList();
    }

    // ================= VALIDATE =================

    public boolean isValid(String token, JwtType expectedType) {
        try {
            Claims claims = extractAllClaims(token);

            return claims.getSubject() != null
                    && expectedType.name().equals(claims.get("type", String.class))
                    && !isExpired(claims);

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isExpired(String token) {
        return isExpired(extractAllClaims(token));
    }

    private boolean isExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }
}