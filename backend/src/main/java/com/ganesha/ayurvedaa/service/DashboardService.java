package com.ganesha.ayurvedaa.service;

import com.ganesha.ayurvedaa.dto.DashboardDto;
import com.ganesha.ayurvedaa.model.*;
import com.ganesha.ayurvedaa.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicineRepository medicineRepository;
    private final BillRepository billRepository;

    public DashboardDto getDashboardStats() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();

        // Patient stats
        long totalPatients = patientRepository.count();
        long activePatients = patientRepository.countByStatus(Patient.Status.ACTIVE);
        long inactivePatients = patientRepository.countByStatus(Patient.Status.INACTIVE);
        long newPatientsToday = patientRepository.countNewPatientsSince(startOfDay);

        // Appointment stats
        long totalAppointments = appointmentRepository.count();
        long confirmed = appointmentRepository.countByStatus(Appointment.AppointmentStatus.CONFIRMED);
        long cancelled = appointmentRepository.countByStatus(Appointment.AppointmentStatus.CANCELLED);
        long followUp = appointmentRepository.countByStatus(Appointment.AppointmentStatus.FOLLOW_UP);

        // Billing stats
        var totalBilling = billRepository.getTotalBilling();
        var pendingPayments = billRepository.getTotalPendingAmount();
        var collectedPayments = billRepository.getTotalCollectedAmount();
        long totalBills = billRepository.count();

        // Medicine stats
        long totalMedicines = medicineRepository.count();
        long tablets = medicineRepository.countByType(Medicine.MedicineType.TABLET);
        long syrups = medicineRepository.countByType(Medicine.MedicineType.SYRUP);
        long powders = medicineRepository.countByType(Medicine.MedicineType.POWDER);

        // Recent patient records
        List<Appointment> recentAppointments = appointmentRepository.findTop10ByOrderByCreatedAtDesc();
        List<DashboardDto.RecentPatientRecord> recentRecords = recentAppointments.stream()
                .map(a -> DashboardDto.RecentPatientRecord.builder()
                        .patientId(a.getPatient().getPatientId())
                        .ganId(a.getPatient().getGanId())
                        .patientName(a.getPatient().getFullName())
                        .phone(a.getPatient().getPhone())
                        .doctorName("Dr. " + a.getDoctor().getName())
                        .visitType(a.getVisitType().name())
                        .appointmentDate(a.getAppointmentDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")))
                        .dosha(a.getPatient().getDosha() != null ? a.getPatient().getDosha().name() : "")
                        .status(a.getStatus().name())
                        .build())
                .collect(Collectors.toList());

        // Low stock medicines
        List<Medicine> lowStockMedicines = medicineRepository.findByStockStatus(Medicine.StockStatus.LOW_STOCK);
        List<DashboardDto.LowStockMedicine> lowStockList = lowStockMedicines.stream()
                .map(m -> DashboardDto.LowStockMedicine.builder()
                        .id(m.getId())
                        .name(m.getName())
                        .quantity(m.getQuantity())
                        .type(m.getType().name())
                        .build())
                .collect(Collectors.toList());

        return DashboardDto.builder()
                .totalPatients(totalPatients)
                .activePatients(activePatients)
                .inactivePatients(inactivePatients)
                .newPatientsToday(newPatientsToday)
                .totalAppointments(totalAppointments)
                .confirmedAppointments(confirmed)
                .cancelledAppointments(cancelled)
                .followUpAppointments(followUp)
                .totalBilling(totalBilling)
                .pendingPayments(pendingPayments)
                .collectedPayments(collectedPayments)
                .totalBillsGenerated(totalBills)
                .totalMedicines(totalMedicines)
                .tablets(tablets)
                .syrups(syrups)
                .powders(powders)
                .recentPatientRecords(recentRecords)
                .lowStockMedicines(lowStockList)
                .build();
    }
}
