package com.ganesha.ayurvedaa.repository;

import com.ganesha.ayurvedaa.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPatientId(String patientId);
    long countByStatus(Patient.Status status);

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.createdAt >= :startDate")
    long countNewPatientsSince(LocalDateTime startDate);
}
