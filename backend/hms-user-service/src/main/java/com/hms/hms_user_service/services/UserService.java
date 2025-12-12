package com.hms.hms_user_service.services;

import com.hms.hms_user_service.dto.LoginRequest;
import com.hms.hms_user_service.dto.LoginResponse;
import com.hms.hms_user_service.dto.RegisterRequest;
import com.hms.hms_user_service.dto.RegisterResponse;
import com.hms.hms_user_service.errors.UserAlreadyExistsException;
import com.hms.hms_user_service.mapper.Mapper;
import com.hms.hms_user_service.model.User;
import com.hms.hms_user_service.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final JwtService jwtService;
    private final SessionService sessionService;

    public RegisterResponse createUser(RegisterRequest registerRequest) {
        Optional<User> user = userRepository.findByEmail(registerRequest.getEmail());
        if (user.isPresent()) {
            log.error("User with email {} already exists", registerRequest.getEmail());
            throw new UserAlreadyExistsException("User with email " + registerRequest.getEmail() + " already exists");
        }
        User newUser = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .roles(registerRequest.getRoles())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();
        User savedUser = userRepository.save(newUser);
        log.info("User with email {} created successfully", savedUser.getEmail());
        return Mapper.toRegisterResponse(savedUser);
    }


    public LoginResponse loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
        String accessToken = "";
        String refreshToken = "";
        if (authentication.isAuthenticated()) {
            log.info("Logging in user");
            System.out.println((Object) authentication.getPrincipal());
            UserDetails userDetails = appUserDetailsService.loadUserByUsername(authentication.getName());
            accessToken = getAccessToken(userDetails.getUsername());
            refreshToken = getRefreshToken(userDetails.getUsername());
            sessionService.generateNewSession(userDetails.getUsername(), refreshToken);
        } else {
            log.info("User not authenticated while Login");
            throw new UsernameNotFoundException("User not authenticated");
        }
        return LoginResponse
                .builder()
                .email(loginRequest.getEmail())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public LoginResponse refreshToken(String refreshToken) {
        log.info("Refreshing token");
        String userEmail = jwtService.getUserEmailFromToken(refreshToken);
        sessionService.validateSession(refreshToken);
        UserDetails userDetails = appUserDetailsService.loadUserByUsername(userEmail);
        if (jwtService.validateToken(refreshToken, userDetails)) {
            String newAccessToken = getAccessToken(userEmail);
            String newRefreshToken = getRefreshToken(userEmail);
            log.info("Refresh token validated and new tokens generated for user: {}", userEmail);
            return LoginResponse.builder()
                    .email(userEmail)
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .build();
        } else {
            log.error("Invalid refresh token for user: {}", userEmail);
            throw new UsernameNotFoundException("Invalid refresh token");
        }
    }

    public String getAccessToken(String email) {
        log.info("Generating access token");
        return jwtService.generateAccessToken(email);
    }

    public String getRefreshToken(String email) {
        log.info("Generating refresh token");
        return jwtService.generateRefreshToken(email);
    }


    private Authentication authenticateUser(String email, String password) {
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }
}
