package com.ganesha.ayurvedaa.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String patientId; // e.g., PT458652

    @Column(nullable = false)
    private String ganId; // e.g., GAN2025-0129

    @Column(nullable = false)
    private String fullName;

    private String phone;
    private String email;
    private String address;
    private Integer age;
    private String gender;

    @Enumerated(EnumType.STRING)
    private Dosha dosha;

    @Enumerated(EnumType.STRING)
    private Status status;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;

    public enum Dosha {
        VATA, PITTA, KAPHA, VATA_PITTA, PITTA_KAPHA, VATA_KAPHA, TRIDOSHA
    }

    public enum Status {
        ACTIVE, INACTIVE
    }
}
