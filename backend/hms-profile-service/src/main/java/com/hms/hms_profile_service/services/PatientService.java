package com.hms.hms_profile_service.services;

import com.hms.hms_profile_service.dto.PatientRequest;
import com.hms.hms_profile_service.dto.PatientResponse;
import com.hms.hms_profile_service.model.Address;
import com.hms.hms_profile_service.model.Patient;
import com.hms.hms_profile_service.repository.PatientRepository;
import com.hms.hms_profile_service.store.UserContextHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientService {

    private final PatientRepository patientRepository;

    @Transactional
    public PatientResponse createPatientProfile(PatientRequest patientRequest) {
        log.info("Creating patient profile in PatientService");
        String currentUserId = UserContextHolder.getCurrentUserId();
        Patient newPatient = Patient.builder()
                .address(Address.builder()
                        .addressLine1(patientRequest.getAddress().getAddressLine1())
                        .addressLine2(patientRequest.getAddress().getAddressLine2())
                        .addressLine3(patientRequest.getAddress().getAddressLine3())
                        .city(patientRequest.getAddress().getCity())
                        .state(patientRequest.getAddress().getState())
                        .pinCode(patientRequest.getAddress().getPinCode())
                        .country(patientRequest.getAddress().getCountry())
                        .build()).age(patientRequest.getAge())
                .phoneNumber(patientRequest.getPhoneNumber())
                .gender(patientRequest.getGender())
                .patientId(currentUserId)
                .build();
        Patient createdPatient = patientRepository.save(newPatient);
        return PatientResponse.builder()
                .patientId(currentUserId)
                .age(createdPatient.getAge())
                .phoneNumber(createdPatient.getPhoneNumber())
                .build();
    }
}
