package com.hms.hms_user_service.services;

import com.hms.hms_user_service.model.Role;
import com.hms.hms_user_service.model.User;
import com.hms.hms_user_service.utils.PermissionMapping;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
        Set<SimpleGrantedAuthority> authoritiesList = new HashSet<>();

        authorities.forEach(role -> {
            Role userRole = Role.valueOf(role.getAuthority());
            Set<SimpleGrantedAuthority> perms = PermissionMapping.getPermissionsByRole(userRole);
            authoritiesList.addAll(perms);
            authoritiesList.add(new SimpleGrantedAuthority("ROLE_" + role.getAuthority()));
        });
        return authoritiesList;


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
