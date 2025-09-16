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
            admin.setUsername("admin@hospital.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMINISTRATOR);
            admin.setName("System Administrator");
            admin.setEmail("admin@hospital.com");
            admin.setPhone("+1-555-0001");
            userRepository.save(admin);
        }

    }
}