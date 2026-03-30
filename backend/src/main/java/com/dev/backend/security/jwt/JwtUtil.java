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
    private String secret;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
    }

    // ================= GENERATE =================

    public String generateAccessToken(int userId, List<String> roles, List<String> permissions) {
        return generateToken(userId, roles, permissions, JwtType.ACCESS);
    }

    public String generateRefreshToken(int userId) {
        return generateToken(userId, null, null, JwtType.REFRESH);
    }

    private String generateToken(int userId, List<String> roles,
                                 List<String> permissions, JwtType type) {

        var builder = Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("type", type.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + type.getExpirationMillis()))
                .signWith(getKey(), SignatureAlgorithm.HS256);

        if (roles != null) builder.claim("roles", roles);
        if (permissions != null) builder.claim("permissions", permissions);

        return builder.compact();
    }

    // ================= EXTRACT =================

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUserId(String token) {
        return parseClaims(token).getSubject();
    }

    public List<String> getRoles(String token) {
        List<?> roles = parseClaims(token).get("roles", List.class);
        return roles == null ? List.of() : roles.stream().map(Object::toString).toList();
    }

    public String getType(String token) {
        return parseClaims(token).get("type", String.class);
    }

    // ================= VALIDATE =================

    public boolean validate(String token, JwtType type) {
        try {
            Claims claims = parseClaims(token);

            return claims.getSubject() != null
                    && type.name().equals(claims.get("type", String.class))
                    && !claims.getExpiration().before(new Date());

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}