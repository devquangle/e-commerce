package com.dev.backend.security.jwt;

import java.util.Base64;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String BASE64_SECRET_KEY = "IUhuQQpG1l3gA5aFf9SjfjRau2WiXYDIORDGWkggqNBIv4aGb5";
    private final SecretKey SIGNING_KEY =
            Keys.hmacShaKeyFor(Base64.getDecoder().decode(BASE64_SECRET_KEY));

    private static final long ACCESS_TOKEN_EXPIRATION = 1000L * 60 * 15;
    private static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7;
    private static final long RESET_PASSWORD_EXPIRATION = 1000L * 60 * 15;

    private static final String TYPE_LOGIN = "LOGIN";
    private static final String TYPE_REFRESH = "REFRESH";
    private static final String TYPE_RESET = "RESET_PASSWORD";

    // ================= GENERATE =================

    public String generateAccessToken(int userId, List<String> roles, List<String> permissions) {
        return generateToken(userId, roles, permissions, TYPE_LOGIN, ACCESS_TOKEN_EXPIRATION);
    }

    public String generateRefreshToken(int userId) {
        return generateToken(userId, null, null, TYPE_REFRESH, REFRESH_TOKEN_EXPIRATION);
    }

    public String generateResetPasswordToken(int userId) {
        return generateToken(userId, null, null, TYPE_RESET, RESET_PASSWORD_EXPIRATION);
    }

    private String generateToken(int userId, List<String> roles, List<String> permissions,
                                 String type, long expiration) {

        var builder = Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("typeJWT", type)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS256);

        if (roles != null) builder.claim("roles", roles);
        if (permissions != null) builder.claim("permissions", permissions);

        return builder.compact();
    }

    // ================= EXTRACT =================

    public String extractUserId(String token) {
        return parseClaims(token).getSubject();
    }

    public List<String> extractRoles(String token) {
        List<?> roles = parseClaims(token).get("roles", List.class);
        return roles == null ? List.of() : roles.stream().map(Object::toString).toList();
    }

    public List<String> extractPermissions(String token) {
        List<?> permissions = parseClaims(token).get("permissions", List.class);
        return permissions == null ? List.of() : permissions.stream().map(Object::toString).toList();
    }

    public String extractType(String token) {
        return parseClaims(token).get("typeJWT", String.class);
    }

    // ================= VALIDATE =================

    public boolean validateAccessToken(String token) {
        return validateToken(token, TYPE_LOGIN);
    }

    public boolean validateRefreshToken(String token) {
        return validateToken(token, TYPE_REFRESH);
    }

    private boolean validateToken(String token, String expectedType) {
        try {
            Claims claims = parseClaims(token);

            return expectedType.equals(claims.get("typeJWT", String.class))
                    && !isExpired(claims);

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}