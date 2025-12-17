package com.hms.hms_profile_service.services;

import com.hms.hms_profile_service.dto.PatientRequest;
import com.hms.hms_profile_service.dto.PatientResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final PatientService patientService;
    private final DoctorService doctorService;

    public PatientResponse createPatientProfile(PatientRequest patientRequest) {
        log.info("Creating patient profile in ProfileService");
        return patientService.createPatientProfile(patientRequest);
    }
}
