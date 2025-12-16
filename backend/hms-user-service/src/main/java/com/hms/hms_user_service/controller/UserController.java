package com.hms.hms_user_service.controller;


import com.hms.hms_user_service.dto.*;
import com.hms.hms_user_service.services.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Arrays;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/core")
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> createUser(@RequestBody RegisterRequest profileRequest) {
        log.info("Received request to create user with email: {}", profileRequest.getEmail());
        return ResponseEntity.ok(userService.createUser(profileRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        log.info("Received login request for email: {}", loginRequest.getEmail());
        try {
            LoginResponse loginResponse = userService.loginUser(loginRequest);
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", loginResponse.getRefreshToken())
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofDays(180)) // 180 days
                    .sameSite("Strict")
                    .build();

            ResponseCookie accessCookie = ResponseCookie.from("accessToken", loginResponse.getAccessToken())
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofMinutes(15))
                    .sameSite("Strict")
                    .build();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                    .body(loginResponse);
        } catch (ExpiredJwtException eje) {
            log.warn("Expired JWT detected while processing login request for {}: {}", loginRequest.getEmail(), eje.getMessage());
            // Return clear 401 so client can clear stored tokens and retry authentication
            return ResponseEntity.status(401).body(
                    LoginResponse.builder()
                            .email(loginRequest.getEmail())
                            .accessToken("") // explicit empty tokens
                            .refreshToken("")
                            .name("")
                            .userId("")
                            .build()
            );
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        log.info("Attempting to refresh token");
        try {
            Cookie[] cookies = request.getCookies();
            if (cookies == null || cookies.length == 0) {
                log.warn("No cookies present on refresh-token request");
                throw new AuthenticationServiceException("Refresh token not found");
            }
            Cookie refreshToken =
                    Arrays.stream(cookies)
                            .filter(cookie -> cookie.getName().equals("refreshToken"))
                            .findFirst()
                            .orElseThrow(() -> new AuthenticationServiceException("Refresh token not found"));
            log.info("Received request to refresh token");
            String refreshTokenValue = refreshToken.getValue();
            log.info("Refresh token value: {}", refreshTokenValue);
            LoginResponse loginResponse = userService.refreshToken(refreshTokenValue);
            return ResponseEntity.ok().body(loginResponse);
        } catch (ExpiredJwtException eje) {
            log.warn("Expired JWT detected on refresh-token: {}", eje.getMessage());
            return ResponseEntity.status(401).body(
                    LoginResponse.builder()
                            .email("")
                            .accessToken("")
                            .refreshToken("")
                            .name("")
                            .userId("")
                            .build()
            );
        }
    }

    //    @Secured({"ROLE_PATIENT", "ROLE_ADMIN"})
//    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN') AND hasAuthority('PATIENT_VIEW')")
    @GetMapping("/user/me")
    public ResponseEntity<String> getCurrentUser(HttpServletRequest request) {
        log.info("Received request to get current user");
        return ResponseEntity.ok().body("Current user endpoint");
    }

//    @PreAuthorize("hasRole('PATIENT','DOCTOR')")
    @GetMapping("/user/profile")
    public ResponseEntity<ProfileResponse> getUserProfile(@CurrentSecurityContext SecurityContext securityContext) {
        log.info("Received request to get user profile");
        ProfileResponse userProfile = userService.getUserProfile(securityContext.getAuthentication().getName());
        return ResponseEntity.ok().body(userProfile);
    }

}
