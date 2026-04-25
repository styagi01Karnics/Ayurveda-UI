package com.ganesha.ayurvedaa.repository;

import com.ganesha.ayurvedaa.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByStockStatus(Medicine.StockStatus stockStatus);
    long countByType(Medicine.MedicineType type);

    @Query("SELECT SUM(m.quantity) FROM Medicine m")
    Long getTotalStock();
}
