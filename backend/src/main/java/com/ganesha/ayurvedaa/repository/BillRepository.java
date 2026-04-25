package com.ganesha.ayurvedaa.repository;

import com.ganesha.ayurvedaa.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Bill b")
    BigDecimal getTotalBilling();

    @Query("SELECT COALESCE(SUM(b.pendingAmount), 0) FROM Bill b WHERE b.paymentStatus != 'PAID'")
    BigDecimal getTotalPendingAmount();

    @Query("SELECT COALESCE(SUM(b.paidAmount), 0) FROM Bill b")
    BigDecimal getTotalCollectedAmount();
}
