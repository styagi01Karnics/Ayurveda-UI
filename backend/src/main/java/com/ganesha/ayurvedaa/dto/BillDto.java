package com.ganesha.ayurvedaa.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BillDto {
    private Long patientId;
    private Long appointmentId;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private String paymentMode;
    private String paymentStatus;
}
