package com.hms.hms_user_service.services;

import com.hms.hms_user_service.dto.*;
import com.hms.hms_user_service.errors.UserAlreadyExistsException;
import com.hms.hms_user_service.mapper.Mapper;
import com.hms.hms_user_service.model.User;
import com.hms.hms_user_service.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        String name = "";
        String id = "";
        if (authentication.isAuthenticated()) {
            log.info("Logging in user");
            System.out.println((Object) authentication.getPrincipal());
            UserDetails userDetails = appUserDetailsService.loadUserByUsername(authentication.getName());
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> {
                log.error("User with email {} not found after authentication", userDetails.getUsername());
                return new UsernameNotFoundException("User with email " + userDetails.getUsername() + " not found");
            });
            accessToken = getAccessToken(user);
            refreshToken = getRefreshToken(user);
            sessionService.generateNewSession(userDetails.getUsername(), refreshToken);
            name = user.getName();
            id = user.getUserId();
            log.info("User {} logged in successfully", loginRequest.getEmail());
        } else {
            log.info("User not authenticated while Login");
            throw new UsernameNotFoundException("User not authenticated");
        }
        return LoginResponse
                .builder()
                .email(loginRequest.getEmail())
                .name(name)
                .userId(id)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public LoginResponse refreshToken(String refreshToken) {
        log.info("Refreshing token");
        String userId = jwtService.getUserIdFromToken(refreshToken);
        sessionService.validateSession(refreshToken);
        User userInDb = userRepository.findByUserId(userId).orElseThrow(() -> {
            log.error("User with id {} not found during session validation", userId);
            return new UsernameNotFoundException("User with id " + userId + " not found");
        });
        UserDetails userDetails = appUserDetailsService.loadUserByUsername(userInDb.getEmail());
        User user = userRepository.findByUserId(userId).orElseThrow(() -> {
            log.error("User with id {} not found during token refresh", userId);
            return new UsernameNotFoundException("User with id " + userId + " not found");
        });
        if (jwtService.validateToken(refreshToken, userDetails)) {
            String newAccessToken = getAccessToken(user);
//            String newRefreshToken = getRefreshToken(userEmail);
            log.info("Refresh token validated and new tokens generated for user: {}", user.getEmail());
            return LoginResponse.builder()
                    .email(user.getEmail())
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken)
                    .build();
        } else {
            log.error("Invalid refresh token for user: {}", user.getEmail());
            throw new UsernameNotFoundException("Invalid refresh token");
        }
    }

    public ProfileResponse getUserProfile(String email) {
        log.info("Fetching user profile for email: {}", email);
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            log.error("User with email {} not found", email);
            return new UsernameNotFoundException("User with email " + email + " not found");
        });
        return ProfileResponse.builder()
                .email(user.getEmail())
                .name(user.getName())
                .userId(user.getUserId())
                .roles(user.getRoles())
                .build();
    }

    public String getAccessToken(User user) {
        log.info("Generating access token for user: {}", user.getEmail());
        return jwtService.generateAccessToken(user);
    }

    public String getRefreshToken(User user) {
        log.info("Generating refresh token for user: {}", user.getEmail());
        return jwtService.generateRefreshToken(user);
    }


    private Authentication authenticateUser(String email, String password) {
        log.info("Authenticating user: {}", email);
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }
}
