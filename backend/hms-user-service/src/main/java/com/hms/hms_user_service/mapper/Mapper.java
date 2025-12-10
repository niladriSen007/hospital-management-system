package com.hms.hms_user_service.mapper;

import com.hms.hms_user_service.dto.RegisterResponse;
import com.hms.hms_user_service.model.User;

public class Mapper {

    public static RegisterResponse toRegisterResponse(User user) {
        return RegisterResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .roles(user.getRoles())
                .build();
    }
}
