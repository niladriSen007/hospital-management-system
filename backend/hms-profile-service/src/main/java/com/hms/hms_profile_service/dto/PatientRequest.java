package com.hms.hms_profile_service.dto;

import com.hms.hms_profile_service.model.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientRequest {
    private int age;
    private String phoneNumber;
    private Gender gender;
    private AddressRequest address;
}
