package com.ganesha.ayurvedaa.config;

import com.ganesha.ayurvedaa.model.*;
import com.ganesha.ayurvedaa.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicineRepository medicineRepository;
    private final BillRepository billRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedDoctors();
        seedPatients();
        seedMedicines();
        seedAppointmentsAndBills();
        log.info("Data seeding completed successfully!");
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@ganesha.com")) {
            User admin = User.builder()
                    .email("admin@ganesha.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Rahul Sharma")
                    .role(User.Role.SUPER_ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user seeded: admin@ganesha.com / admin123");
        }

        if (!userRepository.existsByEmail("dr.sheekha@ganesha.com")) {
            User doctor = User.builder()
                    .email("dr.sheekha@ganesha.com")
                    .password(passwordEncoder.encode("doctor123"))
                    .fullName("Sheekha Verma")
                    .role(User.Role.DOCTOR)
                    .active(true)
                    .build();
            userRepository.save(doctor);
            log.info("Doctor user seeded: dr.sheekha@ganesha.com / doctor123");
        }
    }

    private void seedDoctors() {
        if (doctorRepository.count() == 0) {
            Doctor doc1 = Doctor.builder()
                    .name("Sheekha Verma")
                    .specialization("Panchakarma & General Ayurveda")
                    .qualification("BAMS, MD (Ayurveda)")
                    .phone("+91-9876543210")
                    .email("dr.sheekha@ganesha.com")
                    .registrationNumber("AYU-2019-4521")
                    .available(true)
                    .build();

            Doctor doc2 = Doctor.builder()
                    .name("Arjun Mehta")
                    .specialization("Nadi Pariksha & Diet Therapy")
                    .qualification("BAMS")
                    .phone("+91-9876543211")
                    .email("dr.arjun@ganesha.com")
                    .registrationNumber("AYU-2020-1234")
                    .available(true)
                    .build();

            doctorRepository.save(doc1);
            doctorRepository.save(doc2);
        }
    }

    private void seedPatients() {
        if (patientRepository.count() == 0) {
            for (int i = 1; i <= 20; i++) {
                Patient patient = Patient.builder()
                        .patientId("PT" + (458652 + i))
                        .ganId("GAN2025-0" + String.format("%03d", i))
                        .fullName(getPatientName(i))
                        .phone("+91-920506" + (1330 + i))
                        .email("patient" + i + "@example.com")
                        .age(25 + i)
                        .gender(i % 2 == 0 ? "Male" : "Female")
                        .dosha(Patient.Dosha.values()[i % Patient.Dosha.values().length])
                        .status(i <= 16 ? Patient.Status.ACTIVE : Patient.Status.INACTIVE)
                        .build();
                patientRepository.save(patient);
            }
        }
    }

    private void seedMedicines() {
        if (medicineRepository.count() == 0) {
            String[] names = {"Tab OCRIS 200", "Ashwagandha Churna", "Triphala Tablet",
                    "Brahmi Syrup", "Neem Powder", "Giloy Tablet", "Amla Juice",
                    "Shatavari Churna", "Arjuna Tablet", "Dashmool Kadha"};

            Medicine.MedicineType[] types = {
                Medicine.MedicineType.TABLET, Medicine.MedicineType.POWDER, Medicine.MedicineType.TABLET,
                Medicine.MedicineType.SYRUP, Medicine.MedicineType.POWDER, Medicine.MedicineType.TABLET,
                Medicine.MedicineType.SYRUP, Medicine.MedicineType.POWDER, Medicine.MedicineType.TABLET,
                Medicine.MedicineType.KADHA
            };

            int[] quantities = {3, 150, 200, 80, 5, 300, 60, 120, 250, 40};

            for (int i = 0; i < names.length; i++) {
                Medicine.StockStatus status = quantities[i] <= 10
                        ? Medicine.StockStatus.LOW_STOCK
                        : Medicine.StockStatus.IN_STOCK;

                Medicine medicine = Medicine.builder()
                        .name(names[i])
                        .type(types[i])
                        .quantity(quantities[i])
                        .lowStockThreshold(10)
                        .price(BigDecimal.valueOf(50 + i * 15))
                        .stockStatus(status)
                        .build();
                medicineRepository.save(medicine);
            }
        }
    }

    private void seedAppointmentsAndBills() {
        if (appointmentRepository.count() == 0) {
            Doctor doctor = doctorRepository.findAll().get(0);
            Patient patient = patientRepository.findAll().get(0);

            for (int i = 0; i < 10; i++) {
                Appointment appt = Appointment.builder()
                        .patient(patient)
                        .doctor(doctor)
                        .appointmentDate(LocalDateTime.now().minusDays(i))
                        .visitType(i % 2 == 0 ? Appointment.VisitType.CONSULTATION : Appointment.VisitType.FOLLOW_UP)
                        .status(Appointment.AppointmentStatus.COMPLETED)
                        .chiefComplaint("Back Pain Consultation")
                        .build();
                appointmentRepository.save(appt);

                Bill bill = Bill.builder()
                        .billNumber("BILL-2025-" + String.format("%04d", i + 1))
                        .patient(patient)
                        .appointment(appt)
                        .totalAmount(BigDecimal.valueOf(500 + i * 100))
                        .paidAmount(BigDecimal.valueOf(300 + i * 50))
                        .pendingAmount(BigDecimal.valueOf(200 + i * 50))
                        .paymentStatus(i < 5 ? Bill.PaymentStatus.PAID : Bill.PaymentStatus.PENDING)
                        .build();
                billRepository.save(bill);
            }
        }
    }

    private String getPatientName(int i) {
        String[] names = {"Khushi Shroff", "Rahul Patel", "Priya Sharma", "Amit Kumar",
                "Sneha Gupta", "Vijay Singh", "Anita Joshi", "Rohit Verma",
                "Kavya Nair", "Suresh Reddy", "Meena Iyer", "Arjun Das",
                "Pooja Agarwal", "Kiran Malhotra", "Deepa Pillai", "Sanjay Rao",
                "Ritu Bose", "Nikhil Shah", "Divya Menon", "Prakash Tiwari"};
        return i <= names.length ? names[i - 1] : "Patient " + i;
    }
}
