package com.hms.hms_user_service.services;

import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Set;

@Service
public class JwtService {

    JwtBuilder builder = Jwts.builder();
    @Value("${jwt.secret:sdsdcscscscdvgsjgsjcfjsfcjrffwefffefsfsfsfdsfsdfsfdsdfsdfshfcd}")
    private String jwtSecret;

    public String generateToken(String email) {
//        Map<String, Object> claims = new HashMap<>();
//        claims.forEach(builder::claim);
//        return createToken(builder,email);
        return createToken(builder, email);
    }

    private String createToken(JwtBuilder builder, String email) {
        return builder
                .subject(email)
                .claim("email", email)
                .claim("roles", Set.of("PATIENT", "DOCTOR", "ADMIN"))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(getSigningKey())
                .compact();
    }

    public String getUserEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String userEmail = getUserEmailFromToken(token);
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return userEmail.equals(userDetails.getUsername());
        } catch (Exception e) {
            return false;
        }
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
