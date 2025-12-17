package com.hms.hms_profile_service.controller;

import com.hms.hms_profile_service.dto.PatientRequest;
import com.hms.hms_profile_service.dto.PatientResponse;
import com.hms.hms_profile_service.services.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/profile/core")
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/patient")
    public ResponseEntity<PatientResponse> createPatient(@RequestBody PatientRequest patientRequest) {
        log.info("Patient profile creation controller");
        PatientResponse patientProfile = profileService.createPatientProfile(patientRequest);
        return ResponseEntity.ok().body(patientProfile);
    }
}
