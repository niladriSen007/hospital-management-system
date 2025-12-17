package com.hms.hms_profile_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hms_patients",
        indexes = {
                @Index(name = "idx_doctor_email", columnList = "email"),
                @Index(name = "idx_doctor_id", columnList = "doctorId")
        })
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String doctorId;
    private Set<String> specialization = new HashSet<>();
    private String phoneNumber;
    private int age;
    private int experienceInYears;
    private Set<String> degrees = new HashSet<>();
    @OneToOne
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
