package com.ganesha.ayurvedaa.controller;

import com.ganesha.ayurvedaa.model.Medicine;
import com.ganesha.ayurvedaa.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineRepository medicineRepository;

    @GetMapping
    public ResponseEntity<Page<Medicine>> getAll(Pageable pageable) {
        PageRequest sorted = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by("createdAt").descending());
        return ResponseEntity.ok(medicineRepository.findAll(sorted));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Medicine>> getLowStock() {
        return ResponseEntity.ok(medicineRepository.findByStockStatus(Medicine.StockStatus.LOW_STOCK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getById(@PathVariable Long id) {
        return medicineRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Medicine> create(@RequestBody Medicine medicine) {
        updateStockStatus(medicine);
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> update(@PathVariable Long id, @RequestBody Medicine medicine) {
        return medicineRepository.findById(id)
                .map(existing -> {
                    medicine.setId(id);
                    updateStockStatus(medicine);
                    return ResponseEntity.ok(medicineRepository.save(medicine));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        medicineRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void updateStockStatus(Medicine medicine) {
        if (medicine.getQuantity() == null || medicine.getQuantity() == 0) {
            medicine.setStockStatus(Medicine.StockStatus.OUT_OF_STOCK);
        } else if (medicine.getLowStockThreshold() != null
                && medicine.getQuantity() <= medicine.getLowStockThreshold()) {
            medicine.setStockStatus(Medicine.StockStatus.LOW_STOCK);
        } else {
            medicine.setStockStatus(Medicine.StockStatus.IN_STOCK);
        }
    }
}
