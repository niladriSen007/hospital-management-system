package com.hms.hms_user_service.utils;

import com.hms.hms_user_service.model.Permission;
import com.hms.hms_user_service.model.Role;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Map;
import java.util.Set;

import static com.hms.hms_user_service.model.Permission.*;
import static com.hms.hms_user_service.model.Role.*;

public class PermissionMapping {

    private static final Map<Role, Set<Permission>> roleMapping = Map.of(
            PATIENT, Set.of(
                    PATIENT_VIEW,
                    APPOINTMENT_VIEW
            ),
            DOCTOR, Set.of(
                    DOCTOR_VIEW,
                    APPOINTMENT_VIEW
            ),
            ADMIN, Set.of(
                    PATIENT_VIEW,
                    PATIENT_CREATE,
                    PATIENT_UPDATE,
                    PATIENT_DELETE,
                    DOCTOR_VIEW,
                    DOCTOR_CREATE,
                    DOCTOR_UPDATE,
                    DOCTOR_DELETE,
                    APPOINTMENT_VIEW,
                    APPOINTMENT_CREATE,
                    APPOINTMENT_UPDATE,
                    APPOINTMENT_DELETE
            )
    );

    public static Set<SimpleGrantedAuthority> getPermissionsByRole(Role role) {
        Set<Permission> permissions = roleMapping.get(role);
        return permissions.stream()
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .collect(java.util.stream.Collectors.toSet());
    }
}
