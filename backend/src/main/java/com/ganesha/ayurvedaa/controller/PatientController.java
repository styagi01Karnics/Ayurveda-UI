package com.ganesha.ayurvedaa.controller;

import com.ganesha.ayurvedaa.model.Patient;
import com.ganesha.ayurvedaa.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository patientRepository;

    @GetMapping
    public ResponseEntity<Page<Patient>> getAllPatients(Pageable pageable) {
        return ResponseEntity.ok(patientRepository.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        long count = patientRepository.count();
        String seq = String.format("%04d", count + 1);
        int rand = 100000 + (int)(Math.random() * 900000);
        patient.setPatientId("PT" + rand);
        patient.setGanId("GAN" + Year.now().getValue() + "-" + seq);
        if (patient.getStatus() == null) patient.setStatus(Patient.Status.ACTIVE);
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return patientRepository.findById(id)
                .map(existing -> {
                    patient.setId(id);
                    patient.setPatientId(existing.getPatientId());
                    patient.setGanId(existing.getGanId());
                    return ResponseEntity.ok(patientRepository.save(patient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
