package com.hmsv1.config;

import com.hmsv1.entity.*;
import com.hmsv1.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Override
    public void run(String... args) throws Exception {
        // Initialize users if they don't exist
        if (userRepository.count() == 0) {
            // Administrator
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMINISTRATOR);
            admin.setName("System Administrator");
            admin.setEmail("admin@hospital.com");
            admin.setPhone("+1-555-0001");
            userRepository.save(admin);

            // Doctor
            User doctor = new User();
            doctor.setUsername("doctor");
            doctor.setPassword(passwordEncoder.encode("doctor123"));
            doctor.setRole(User.Role.DOCTOR);
            doctor.setName("Dr. John Smith");
            doctor.setEmail("doctor@hospital.com");
            doctor.setPhone("+1-555-0002");
            userRepository.save(doctor);

            // Nurse
            User nurse = new User();
            nurse.setUsername("nurse");
            nurse.setPassword(passwordEncoder.encode("nurse123"));
            nurse.setRole(User.Role.NURSE);
            nurse.setName("Nurse Mary Johnson");
            nurse.setEmail("nurse@hospital.com");
            nurse.setPhone("+1-555-0003");
            userRepository.save(nurse);

            // Receptionist
            User receptionist = new User();
            receptionist.setUsername("reception");
            receptionist.setPassword(passwordEncoder.encode("reception123"));
            receptionist.setRole(User.Role.RECEPTIONIST);
            receptionist.setName("Sarah Wilson");
            receptionist.setEmail("reception@hospital.com");
            receptionist.setPhone("+1-555-0004");
            userRepository.save(receptionist);

            // Pharmacist
            User pharmacist = new User();
            pharmacist.setUsername("pharmacist");
            pharmacist.setPassword(passwordEncoder.encode("pharmacist123"));
            pharmacist.setRole(User.Role.PHARMACIST);
            pharmacist.setName("Mike Brown");
            pharmacist.setEmail("pharmacist@hospital.com");
            pharmacist.setPhone("+1-555-0005");
            userRepository.save(pharmacist);
        }

    }
}