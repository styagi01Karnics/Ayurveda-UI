package com.ganesha.ayurvedaa.repository;

import com.ganesha.ayurvedaa.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    long countByStatus(Appointment.AppointmentStatus status);
    List<Appointment> findByAppointmentDateBetweenOrderByAppointmentDateAsc(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate >= :now ORDER BY a.appointmentDate ASC")
    List<Appointment> findUpcomingAppointments(@Param("now") LocalDateTime now);

    List<Appointment> findTop10ByOrderByCreatedAtDesc();
}
