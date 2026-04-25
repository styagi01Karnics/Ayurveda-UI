package com.ganesha.ayurvedaa.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private MedicineType type;

    private Integer quantity;
    private Integer lowStockThreshold;
    private BigDecimal price;
    private String manufacturer;
    private String batchNumber;

    @Enumerated(EnumType.STRING)
    private StockStatus stockStatus;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum MedicineType {
        TABLET, SYRUP, POWDER, OIL, CAPSULE, CHURNA, KADHA
    }

    public enum StockStatus {
        IN_STOCK, LOW_STOCK, OUT_OF_STOCK
    }
}
