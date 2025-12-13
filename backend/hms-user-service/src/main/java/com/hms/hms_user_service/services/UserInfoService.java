package com.hms.hms_user_service.services;

import com.hms.hms_user_service.model.User;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserInfoService implements UserDetails {

    private String username; // Changed from 'name' to 'email' for clarity
    private String password;
    private List<SimpleGrantedAuthority> authorities;

    public UserInfoService(User userInfo) {
        this.username = userInfo.getEmail();
        this.password = userInfo.getPassword();
        this.authorities = userInfo.getRoles()
                .stream().map(role -> new SimpleGrantedAuthority(role.name())).toList();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.getAuthority()))
                .collect(Collectors.toSet());
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }
}
