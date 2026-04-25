package com.ganesha.ayurvedaa.controller;

import com.ganesha.ayurvedaa.dto.BillDto;
import com.ganesha.ayurvedaa.model.Bill;
import com.ganesha.ayurvedaa.model.Patient;
import com.ganesha.ayurvedaa.repository.BillRepository;
import com.ganesha.ayurvedaa.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    @GetMapping
    public ResponseEntity<Page<Bill>> getAll(Pageable pageable) {
        return ResponseEntity.ok(billRepository.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getById(@PathVariable Long id) {
        return billRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Bill> create(@RequestBody BillDto dto) {
        Bill bill = buildBill(dto, new Bill());
        bill.setBillNumber("BILL-" + String.format("%03d", billRepository.count() + 1));
        return ResponseEntity.ok(billRepository.save(bill));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> update(@PathVariable Long id, @RequestBody BillDto dto) {
        return billRepository.findById(id)
                .map(existing -> {
                    buildBill(dto, existing);
                    return ResponseEntity.ok(billRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        billRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Bill buildBill(BillDto dto, Bill bill) {
        if (dto.getPatientId() != null) {
            Patient patient = patientRepository.findById(dto.getPatientId()).orElse(null);
            bill.setPatient(patient);
        }
        BigDecimal total = dto.getTotalAmount() != null ? dto.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal paid = dto.getPaidAmount() != null ? dto.getPaidAmount() : BigDecimal.ZERO;
        bill.setTotalAmount(total);
        bill.setPaidAmount(paid);
        bill.setPendingAmount(total.subtract(paid).max(BigDecimal.ZERO));
        bill.setPaymentMode(dto.getPaymentMode());
        if (dto.getPaymentStatus() != null) {
            bill.setPaymentStatus(Bill.PaymentStatus.valueOf(dto.getPaymentStatus()));
        }
        return bill;
    }
}
