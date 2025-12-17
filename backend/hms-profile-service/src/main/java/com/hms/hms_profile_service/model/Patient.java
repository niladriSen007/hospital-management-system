package com.hms.hms_profile_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hms_patients",
        indexes = {
                @Index(name = "idx_patient_email", columnList = "email"),
                @Index(name = "idx_patient_id", columnList = "patientId")
        })
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String patientId;
    private int age;
    private String phoneNumber;
    private Gender gender;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
