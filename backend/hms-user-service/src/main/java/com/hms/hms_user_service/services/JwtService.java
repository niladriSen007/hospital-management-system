package com.hms.hms_user_service.services;

import com.hms.hms_user_service.errors.UserNotFoundException;
import com.hms.hms_user_service.model.User;
import com.hms.hms_user_service.repositories.UserRepository;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {

    JwtBuilder builder = Jwts.builder();
    @Value("${jwt.secret:sdsdcscscscdvgsjgsjcfjsfcjrffwefffefsfsfsfdsfsdfsfdsdfsdfshfcd}")
    private String jwtSecret;

    private final UserRepository userRepository;

//    public String generateToken(String email) {

    /// /        Map<String, Object> claims = new HashMap<>();
    /// /        claims.forEach(builder::claim);
    /// /        return createToken(builder,email);
//        return createToken(builder, email);
//    }
    public String generateAccessToken(User user) {
        return createToken(builder, user, 1000L * 60 * 15); // 15 minutes
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder().subject(user.getUserId()).issuedAt(new Date()).expiration(
                        new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 30 * 6) // 6 months
                ).signWith(getSigningKey())
                .compact();
    }

    private String createToken(JwtBuilder builder, User user, Long timeInMillis) {
        User existingUser = userRepository.findByEmail(user.getEmail()).orElseThrow(() ->
                new UserNotFoundException("User with email " + user.getEmail() + " not found"));
        return builder
                .subject(existingUser.getUserId())
                .claim("email", existingUser.getEmail())
                .claim("roles", existingUser.getRoles().toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + timeInMillis))
                .signWith(getSigningKey())
                .compact();
    }

    public String getUserIdFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String userId = getUserIdFromToken(token);
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
