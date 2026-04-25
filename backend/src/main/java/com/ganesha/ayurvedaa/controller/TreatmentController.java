package com.ganesha.ayurvedaa.controller;

import com.ganesha.ayurvedaa.repository.PatientRepository;
import com.ganesha.ayurvedaa.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

// Inner DTO
class TreatmentDto {
    public Long patientId;
    public Long doctorId;
    public String treatmentType;
    public String description;
    public String startDate;
    public String endDate;
    public String status;
    public String medicines;
    public String notes;
}

@RestController
@RequestMapping("/api/treatments")
@RequiredArgsConstructor
public class TreatmentController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    // In-memory store for demo; replace with a proper entity/repo if desired
    private static final java.util.concurrent.CopyOnWriteArrayList<java.util.Map<String, Object>> store =
            new java.util.concurrent.CopyOnWriteArrayList<>();
    private static long counter = 1L;

    @GetMapping
    public ResponseEntity<java.util.Map<String, Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        int from = page * size;
        int to = Math.min(from + size, store.size());
        java.util.List<java.util.Map<String, Object>> content =
                from > store.size() ? java.util.List.of() : store.subList(from, to);
        return ResponseEntity.ok(java.util.Map.of(
                "content", content, "totalElements", store.size(),
                "totalPages", (int) Math.ceil((double) store.size() / size),
                "number", page, "size", size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<java.util.Map<String, Object>> getById(@PathVariable Long id) {
        return store.stream().filter(m -> id.equals(m.get("id")))
                .findFirst().map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<java.util.Map<String, Object>> create(@RequestBody java.util.Map<String, Object> body) {
        body.put("id", counter++);
        body.put("createdAt", LocalDateTime.now().toString());
        enrichNames(body);
        store.add(body);
        return ResponseEntity.ok(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<java.util.Map<String, Object>> update(
            @PathVariable Long id, @RequestBody java.util.Map<String, Object> body) {
        for (int i = 0; i < store.size(); i++) {
            if (id.equals(store.get(i).get("id"))) {
                body.put("id", id);
                enrichNames(body);
                store.set(i, body);
                return ResponseEntity.ok(body);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        store.removeIf(m -> id.equals(m.get("id")));
        return ResponseEntity.noContent().build();
    }

    private void enrichNames(java.util.Map<String, Object> body) {
        Object pid = body.get("patientId");
        if (pid != null) {
            patientRepository.findById(Long.parseLong(pid.toString()))
                    .ifPresent(p -> body.put("patientName", p.getFullName()));
        }
        Object did = body.get("doctorId");
        if (did != null) {
            doctorRepository.findById(Long.parseLong(did.toString()))
                    .ifPresent(d -> body.put("doctorName", d.getName()));
        }
    }
}
