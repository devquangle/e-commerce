package com.dev.backend.security.jwt;

import java.util.Base64;
import java.util.Date;

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
    public String generateAccessToken(int userId, int tokenVersion) {
        return buildToken(userId, tokenVersion, JwtType.ACCESS);
    }

    public String generateRefreshToken(int userId, int tokenVersion) {
        return buildToken(userId, tokenVersion, JwtType.REFRESH);
    }

    public String generateVerifyToken(int userId, int tokenVersion) {
        return buildToken(userId, tokenVersion, JwtType.VERIFY_EMAIL);
    }

    public String generateResetPasswordToken(int userId, int tokenVersion) {
        return buildToken(userId, tokenVersion, JwtType.RESET_PASSWORD);
    }

    private String buildToken(int userId, int tokenVersion, JwtType type) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("tokenVersion", tokenVersion)
                .claim("type", type.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + type.getExpirationMillis()))
                .signWith(signingKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ================= PARSE =================
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public int extractUserId(String token) {
        return Integer.parseInt(extractAllClaims(token).getSubject());
    }

    public JwtType extractType(String token) {
        String type = extractAllClaims(token).get("type", String.class);
        return JwtType.valueOf(type);
    }

    public int extractTokenVersion(String token) {
        Integer version = extractAllClaims(token).get("tokenVersion", Integer.class);
        return version == null ? 0 : version;
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

    // ================= HELPER =================
    public boolean isTokenVersionValid(String token, int dbTokenVersion) {
        return extractTokenVersion(token) == dbTokenVersion;
    }
}