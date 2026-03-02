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

    private static final String BASE64_SECRET_KEY =
            "IUhuQQpG1l3gA5aFf9SjfjRau2WiXYDIORDGWkggqNBIv4aGb5";

    private final SecretKey SIGNING_KEY =
            Keys.hmacShaKeyFor(Base64.getDecoder().decode(BASE64_SECRET_KEY));

    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7;
    private static final long EXPIRATION_TIME_RESETPASSWORD = 1000L * 60 * 15;
    private static final String TYPEJWT_LOGIN = "LOGIN";

    // ✅ GENERATE TOKEN (LIST ROLE)
    public String generateToken(int userId, List<String> roles, String typeJWT) {
        try {
            return Jwts.builder()
                    .setSubject(String.valueOf(userId))
                    .claim("roles", roles)
                    .claim("typeJWT", typeJWT)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis()
                            + (TYPEJWT_LOGIN.equals(typeJWT)
                            ? EXPIRATION_TIME
                            : EXPIRATION_TIME_RESETPASSWORD)))
                    .signWith(SIGNING_KEY, SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi tạo JWT: " + e.getMessage());
            return null;
        }
    }

    // ✅ EXTRACT USER ID
    public String extractUserId(String token) {
        return parseClaims(token).getSubject();
    }

    // ✅ EXTRACT ROLE LIST
    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return parseClaims(token).get("roles", List.class);
    }

    public String extractTypeJWT(String token) {
        return parseClaims(token).get("typeJWT", String.class);
    }

    public boolean validateToken(String token, int userId, String expectedTypeJWT) {
        try {
            Claims claims = parseClaims(token);

            return claims.getSubject().equals(String.valueOf(userId))
                    && claims.get("typeJWT", String.class).equals(expectedTypeJWT)
                    && !isTokenExpired(claims);

        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("❌ Token không hợp lệ: " + e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(Claims claims) {
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