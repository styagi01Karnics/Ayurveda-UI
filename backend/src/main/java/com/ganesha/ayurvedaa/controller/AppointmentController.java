package com.ganesha.ayurvedaa.controller;

import com.ganesha.ayurvedaa.model.Appointment;
import com.ganesha.ayurvedaa.repository.AppointmentRepository;
import com.ganesha.ayurvedaa.repository.DoctorRepository;
import com.ganesha.ayurvedaa.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @GetMapping
    public ResponseEntity<Page<Appointment>> getAll(Pageable pageable) {
        PageRequest sorted = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by("createdAt").descending());
        return ResponseEntity.ok(appointmentRepository.findAll(sorted));
    }

    @GetMapping("/today")
    public ResponseEntity<List<Appointment>> getToday() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        return ResponseEntity.ok(
                appointmentRepository.findByAppointmentDateBetweenOrderByAppointmentDateAsc(start, end));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Appointment> create(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(appointmentRepository.save(buildAppointment(new Appointment(), body)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return appointmentRepository.findById(id)
                .map(existing -> ResponseEntity.ok(appointmentRepository.save(buildAppointment(existing, body))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Appointment buildAppointment(Appointment apt, Map<String, Object> body) {
        Object pid = body.get("patientId");
        if (pid != null && !pid.toString().isBlank()) {
            patientRepository.findById(Long.parseLong(pid.toString())).ifPresent(apt::setPatient);
        }
        Object did = body.get("doctorId");
        if (did != null && !did.toString().isBlank()) {
            doctorRepository.findById(Long.parseLong(did.toString())).ifPresent(apt::setDoctor);
        }
        Object dateStr = body.get("appointmentDate");
        if (dateStr != null && !dateStr.toString().isBlank()) {
            String ds = dateStr.toString();
            if (ds.length() == 16) ds += ":00"; // datetime-local sends "yyyy-MM-ddTHH:mm"
            apt.setAppointmentDate(LocalDateTime.parse(ds));
        }
        Object vt = body.get("visitType");
        if (vt != null && !vt.toString().isBlank()) {
            apt.setVisitType(Appointment.VisitType.valueOf(vt.toString()));
        }
        Object st = body.get("status");
        if (st != null && !st.toString().isBlank()) {
            apt.setStatus(Appointment.AppointmentStatus.valueOf(st.toString()));
        }
        Object cc = body.get("chiefComplaint");
        if (cc != null) apt.setChiefComplaint(cc.toString());
        Object notes = body.get("notes");
        if (notes != null) apt.setNotes(notes.toString());
        return apt;
    }
}
