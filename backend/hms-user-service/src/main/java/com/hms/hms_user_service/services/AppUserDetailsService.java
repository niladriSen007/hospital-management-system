package com.hms.hms_user_service.services;

import com.hms.hms_user_service.model.User;
import com.hms.hms_user_service.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            log.error("User with email {} not found", email);
            return new UsernameNotFoundException("User with email " + email + " not found");
        });
        log.info("User with email {} found from database", email);
        return new UserInfoService(user);
    }
}
