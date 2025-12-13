package com.hms.hms_user_service.controller;


import com.hms.hms_user_service.dto.LoginRequest;
import com.hms.hms_user_service.dto.LoginResponse;
import com.hms.hms_user_service.dto.RegisterRequest;
import com.hms.hms_user_service.dto.RegisterResponse;
import com.hms.hms_user_service.services.SessionService;
import com.hms.hms_user_service.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.web.bind.annotation.*;

import javax.management.relation.Role;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

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
        LoginResponse loginResponse = userService.loginUser(loginRequest);
        ResponseCookie cookie = ResponseCookie.from("refreshToken", loginResponse.getRefreshToken())
                .httpOnly(true)
                .path("/")
                .sameSite("Strict")
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(loginResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        log.info("Attempting to refresh token");
        Cookie[] cookies = request.getCookies();
        Cookie refreshToken =
                Arrays.stream(cookies)
                        .filter(cookie -> cookie.getName().equals("refreshToken"))
                        .findFirst()
                        .orElseThrow(() -> new AuthenticationServiceException("Refresh token not found"));
        log.info("Received request to refresh token");
        String refreshTokenValue = refreshToken.getValue();
        log.info("Refresh token value: {}", refreshTokenValue);
        LoginResponse loginResponse = userService.refreshToken(refreshTokenValue);
//        Cookie newRefreshToken = new Cookie("refreshToken", loginResponse.getRefreshToken());
//        newRefreshToken.setHttpOnly(true);
//        newRefreshToken.setPath("/");
//        newRefreshToken.setMaxAge((int) Duration.ofDays(7).getSeconds());
//        response.addCookie(newRefreshToken);
        return ResponseEntity.ok()
//                .header(HttpHeaders.SET_COOKIE, newRefreshToken.toString())
                .body(loginResponse);
    }

//    @Secured({"ROLE_PATIENT", "ROLE_ADMIN"})
//    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN') AND hasAuthority('PATIENT_VIEW')")
    @GetMapping("/user/me")
    public ResponseEntity<String> getCurrentUser(HttpServletRequest request) {
        log.info("Received request to get current user");
        return ResponseEntity.ok().body("Current user endpoint");
    }

}
