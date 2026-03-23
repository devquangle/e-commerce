package com.dev.backend.security.jwt;

import java.util.Base64;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // 🔐 Secret key (Base64)
    private static final String BASE64_SECRET_KEY = "IUhuQQpG1l3gA5aFf9SjfjRau2WiXYDIORDGWkggqNBIv4aGb5";

    private final SecretKey SIGNING_KEY = Keys.hmacShaKeyFor(Base64.getDecoder().decode(BASE64_SECRET_KEY));

    // ⏱ Expiration
    private static final long ACCESS_TOKEN_EXPIRATION = 1000L * 60 * 15; // 15 phút
    private static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7; // 7 ngày
    private static final long RESET_PASSWORD_EXPIRATION = 1000L * 60 * 15; // 15 phút

    // 🏷 Token type
    private static final String TYPE_LOGIN = "LOGIN";
    private static final String TYPE_REFRESH = "REFRESH";
    private static final String TYPE_RESET = "RESET_PASSWORD";

    // =====================================================
    // GENERATE TOKEN
    // =====================================================

    public String generateAccessToken(int userId, List<String> roles, List<String> permissions) {
        return generateToken(userId, roles, permissions, TYPE_LOGIN, ACCESS_TOKEN_EXPIRATION);
    }

    public String generateRefreshToken(int userId) {
        return generateToken(userId, null, null, TYPE_REFRESH, REFRESH_TOKEN_EXPIRATION);
    }

    public String generateResetPasswordToken(int userId) {
        return generateToken(userId, null, null, TYPE_RESET, RESET_PASSWORD_EXPIRATION);
    }

    private String generateToken(int userId, List<String> roles, List<String> permissions, String type,
            long expiration) {

        var builder = Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("typeJWT", type)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS256);

        if (roles != null) {
            builder.claim("roles", roles);
        }

        if (permissions != null) {
            builder.claim("permissions", permissions);
        }

        return builder.compact();
    }

    // =====================================================
    // EXTRACT DATA
    // =====================================================

    public String extractUserId(String token) {
        return parseClaims(token).getSubject();
    }

    public List<String> extractRoles(String token) {

        List<?> roles = parseClaims(token).get("roles", List.class);

        if (roles == null) {
            return List.of();
        }

        return roles.stream()
                .map(Object::toString)
                .toList();
    }

    public String extractType(String token) {
        return parseClaims(token).get("typeJWT", String.class);
    }

    // =====================================================
    // VALIDATE TOKEN
    // =====================================================

    public boolean validateToken(String token, int userId, String expectedType) {

        try {

            Claims claims = parseClaims(token);

            return claims.getSubject().equals(String.valueOf(userId))
                    && claims.get("typeJWT", String.class).equals(expectedType)
                    && !isTokenExpired(claims);

        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("❌ Token không hợp lệ: " + e.getMessage());
            return false;
        }
    }

    // =====================================================
    // INTERNAL METHODS
    // =====================================================

    private boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    public boolean validateAccessToken(String token, int userId) {
        return validateToken(token, userId, TYPE_LOGIN);
    }

    public boolean validateRefreshToken(String token, int userId) {
        return validateToken(token, userId, TYPE_REFRESH);
    }

    public List<String> extractPermissions(String token) {

        List<?> permissions = parseClaims(token).get("permissions", List.class);

        if (permissions == null) {
            return List.of();
        }

        return permissions.stream()
                .map(Object::toString)
                .toList();
    }

    private Claims parseClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}