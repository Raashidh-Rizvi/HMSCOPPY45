package com.hmsv1.config;

import com.hmsv1.entity.*;
import com.hmsv1.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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

    @Override
    public void run(String... args) throws Exception {
        // Initialize users if they don't exist
        if (userRepository.count() == 0) {
            // Administrator
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin");
            admin.setRole(User.Role.ADMINISTRATOR);
            admin.setName("System Administrator");
            admin.setEmail("admin@hospital.com");
            admin.setPhone("+1-555-0001");
            userRepository.save(admin);

            // Doctor
            User doctor = new User();
            doctor.setUsername("doctor");
            doctor.setPassword("doctor");
            doctor.setRole(User.Role.DOCTOR);
            doctor.setName("Dr. John Smith");
            doctor.setEmail("doctor@hospital.com");
            doctor.setPhone("+1-555-0002");
            userRepository.save(doctor);

            // Nurse
            User nurse = new User();
            nurse.setUsername("nurse");
            nurse.setPassword("nurse");
            nurse.setRole(User.Role.NURSE);
            nurse.setName("Nurse Mary Johnson");
            nurse.setEmail("nurse@hospital.com");
            nurse.setPhone("+1-555-0003");
            userRepository.save(nurse);

            // Receptionist
            User receptionist = new User();
            receptionist.setUsername("reception");
            receptionist.setPassword("reception");
            receptionist.setRole(User.Role.RECEPTIONIST);
            receptionist.setName("Sarah Wilson");
            receptionist.setEmail("reception@hospital.com");
            receptionist.setPhone("+1-555-0004");
            userRepository.save(receptionist);

            // Pharmacist
            User pharmacist = new User();
            pharmacist.setUsername("pharmacist");
            pharmacist.setPassword("pharmacist");
            pharmacist.setRole(User.Role.PHARMACIST);
            pharmacist.setName("Mike Brown");
            pharmacist.setEmail("pharmacist@hospital.com");
            pharmacist.setPhone("+1-555-0005");
            userRepository.save(pharmacist);
        }

        // Initialize sample patients
        if (patientRepository.count() == 0) {
            Patient patient1 = new Patient();
            patient1.setFirstName("John");
            patient1.setLastName("Doe");
            patient1.setDob(LocalDate.of(1985, 6, 15));
            patient1.setGender("Male");
            patient1.setAddress("123 Main St, City");
            patient1.setPhone("+1-555-0123");
            patient1.setEmail("john.doe@email.com");
            patient1.setRegistrationDate(LocalDate.now());
            patientRepository.save(patient1);

            Patient patient2 = new Patient();
            patient2.setFirstName("Jane");
            patient2.setLastName("Smith");
            patient2.setDob(LocalDate.of(1990, 3, 22));
            patient2.setGender("Female");
            patient2.setAddress("456 Oak Ave, City");
            patient2.setPhone("+1-555-0456");
            patient2.setEmail("jane.smith@email.com");
            patient2.setRegistrationDate(LocalDate.now());
            patientRepository.save(patient2);
        }

        // Initialize sample inventory items
        if (inventoryItemRepository.count() == 0) {
            InventoryItem item1 = new InventoryItem();
            item1.setItemName("Paracetamol 500mg");
            item1.setQuantityAvailable(150);
            item1.setReorderLevel(50);
            item1.setLastRestockDate(LocalDate.now().minusDays(10));
            inventoryItemRepository.save(item1);

            InventoryItem item2 = new InventoryItem();
            item2.setItemName("Surgical Gloves");
            item2.setQuantityAvailable(25);
            item2.setReorderLevel(100);
            item2.setLastRestockDate(LocalDate.now().minusDays(15));
            inventoryItemRepository.save(item2);

            InventoryItem item3 = new InventoryItem();
            item3.setItemName("Bandages");
            item3.setQuantityAvailable(200);
            item3.setReorderLevel(75);
            item3.setLastRestockDate(LocalDate.now().minusDays(5));
            inventoryItemRepository.save(item3);
        }
    }
}