package com.hms.hms_user_service.controller;


import com.hms.hms_user_service.dto.LoginRequest;
import com.hms.hms_user_service.dto.LoginResponse;
import com.hms.hms_user_service.dto.RegisterRequest;
import com.hms.hms_user_service.dto.RegisterResponse;
import com.hms.hms_user_service.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
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
        ResponseCookie cookie = ResponseCookie.from("jwtToken", loginResponse.getToken())
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(10)) // 1 day
                .sameSite("Strict")
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(loginResponse);
    }

}
