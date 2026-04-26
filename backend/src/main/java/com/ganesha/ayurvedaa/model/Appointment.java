package com.ganesha.ayurvedaa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDateTime appointmentDate;

    @Enumerated(EnumType.STRING)
    private VisitType visitType;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String notes;
    private String chiefComplaint;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @JsonProperty public Long getPatientId()   { return patient != null ? patient.getId()       : null; }
    @JsonProperty public String getPatientName() { return patient != null ? patient.getFullName() : null; }
    @JsonProperty public Long getDoctorId()    { return doctor  != null ? doctor.getId()        : null; }
    @JsonProperty public String getDoctorName()  { return doctor  != null ? doctor.getName()      : null; }

    public enum VisitType {
        CONSULTATION, FOLLOW_UP, TREATMENT, PANCHAKARMA
    }

    public enum AppointmentStatus {
        CONFIRMED, CANCELLED, COMPLETED, PENDING, FOLLOW_UP
    }
}
