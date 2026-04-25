package com.ganesha.ayurvedaa.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardDto {
    private long totalPatients;
    private long activePatients;
    private long inactivePatients;
    private long newPatientsToday;

    private long totalAppointments;
    private long confirmedAppointments;
    private long cancelledAppointments;
    private long followUpAppointments;

    private BigDecimal totalBilling;
    private BigDecimal pendingPayments;
    private BigDecimal collectedPayments;
    private long totalBillsGenerated;

    private long totalMedicines;
    private long tablets;
    private long syrups;
    private long powders;

    private List<RecentPatientRecord> recentPatientRecords;
    private List<LowStockMedicine> lowStockMedicines;

    @Data
    @Builder
    public static class RecentPatientRecord {
        private String patientId;
        private String ganId;
        private String patientName;
        private String phone;
        private String doctorName;
        private String visitType;
        private String appointmentDate;
        private String dosha;
        private String status;
    }

    @Data
    @Builder
    public static class LowStockMedicine {
        private Long id;
        private String name;
        private Integer quantity;
        private String type;
    }
}
