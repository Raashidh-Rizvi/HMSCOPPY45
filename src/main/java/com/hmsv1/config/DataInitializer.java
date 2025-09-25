package com.hmsv1.config;

import com.hmsv1.entity.User;
import com.hmsv1.entity.Patient;
import com.hmsv1.repository.UserRepository;
import com.hmsv1.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.time.LocalDate;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== DATABASE INITIALIZATION ===");

        // Check what users exist first
        List<User> existingUsers = userRepository.findAll();
        System.out.println("Existing users count: " + existingUsers.size());
        existingUsers.forEach(user -> {
            System.out.println("User: ID=" + user.getId() +
                    ", Email='" + user.getEmail() + "'" +
                    ", Username='" + user.getUsername() + "'" +
                    ", Name='" + user.getName() + "'");
        });

        String adminEmail = "admin@hospital.com";
        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);

        if (existingAdmin.isEmpty()) {
            System.out.println("Creating admin user...");

            User admin = new User();
            admin.setUsername("admin@hospital.com"); // Set username same as email
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMINISTRATOR);
            admin.setName("System Administrator");
            admin.setEmail(adminEmail);
            admin.setPhone("+1-555-0001");

            User savedAdmin = userRepository.save(admin);

            System.out.println("=== ADMIN USER CREATED ===");
            System.out.println("ID: " + savedAdmin.getId());
            System.out.println("Username: " + savedAdmin.getUsername());
            System.out.println("Email: " + savedAdmin.getEmail());
            System.out.println("Name: " + savedAdmin.getName());
            System.out.println("Password Hash: " + savedAdmin.getPassword());
            System.out.println("Role: " + savedAdmin.getRole());
            System.out.println("==========================");
        } else {
            System.out.println("Admin user already exists:");
            User admin = existingAdmin.get();
            System.out.println("ID: " + admin.getId());
            System.out.println("Username: " + admin.getUsername());
            System.out.println("Email: " + admin.getEmail());
            System.out.println("Name: " + admin.getName());
            System.out.println("Password Hash: " + admin.getPassword());
        }

        // Test the findByEmail method
        Optional<User> testUser = userRepository.findByEmail(adminEmail);
        System.out.println("Test findByEmail('" + adminEmail + "'): " + testUser.isPresent());

        System.out.println("=== DATABASE INITIALIZATION COMPLETE ===");
        
        // Initialize sample data
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        // Create sample patients if none exist
        if (patientRepository.count() == 0) {
            System.out.println("Creating sample patients...");
            
            Patient patient1 = new Patient();
            patient1.setFirstName("John");
            patient1.setLastName("Doe");
            patient1.setDob(LocalDate.of(1985, 6, 15));
            patient1.setGender("Male");
            patient1.setAddress("123 Main St, City, State");
            patient1.setPhone("+1-555-0123");
            patient1.setEmail("john.doe@email.com");
            patient1.setRegistrationDate(LocalDate.now().minusDays(30));
            patientRepository.save(patient1);
            
            Patient patient2 = new Patient();
            patient2.setFirstName("Jane");
            patient2.setLastName("Smith");
            patient2.setDob(LocalDate.of(1990, 3, 22));
            patient2.setGender("Female");
            patient2.setAddress("456 Oak Ave, City, State");
            patient2.setPhone("+1-555-0124");
            patient2.setEmail("jane.smith@email.com");
            patient2.setRegistrationDate(LocalDate.now().minusDays(15));
            patientRepository.save(patient2);
            
            Patient patient3 = new Patient();
            patient3.setFirstName("Robert");
            patient3.setLastName("Johnson");
            patient3.setDob(LocalDate.of(1978, 11, 8));
            patient3.setGender("Male");
            patient3.setAddress("789 Pine St, City, State");
            patient3.setPhone("+1-555-0125");
            patient3.setEmail("robert.johnson@email.com");
            patient3.setRegistrationDate(LocalDate.now().minusDays(5));
            patientRepository.save(patient3);
            
            System.out.println("Sample patients created successfully!");
        }
        
        // Create sample staff if only admin exists
        if (userRepository.count() == 1) {
            System.out.println("Creating sample staff...");
            
            User doctor = new User();
            doctor.setUsername("dr.wilson@hospital.com");
            doctor.setPassword(passwordEncoder.encode("doctor123"));
            doctor.setRole(User.Role.DOCTOR);
            doctor.setName("Dr. Sarah Wilson");
            doctor.setEmail("dr.wilson@hospital.com");
            doctor.setPhone("+1-555-0201");
            userRepository.save(doctor);
            
            User nurse = new User();
            nurse.setUsername("nurse.brown@hospital.com");
            nurse.setPassword(passwordEncoder.encode("nurse123"));
            nurse.setRole(User.Role.NURSE);
            nurse.setName("Nurse Michael Brown");
            nurse.setEmail("nurse.brown@hospital.com");
            nurse.setPhone("+1-555-0301");
            userRepository.save(nurse);
            
            User receptionist = new User();
            receptionist.setUsername("reception@hospital.com");
            receptionist.setPassword(passwordEncoder.encode("reception123"));
            receptionist.setRole(User.Role.RECEPTIONIST);
            receptionist.setName("Lisa Davis");
            receptionist.setEmail("reception@hospital.com");
            receptionist.setPhone("+1-555-0401");
            userRepository.save(receptionist);
            
            User pharmacist = new User();
            pharmacist.setUsername("pharmacy@hospital.com");
            pharmacist.setPassword(passwordEncoder.encode("pharmacy123"));
            pharmacist.setRole(User.Role.PHARMACIST);
            pharmacist.setName("David Martinez");
            pharmacist.setEmail("pharmacy@hospital.com");
            pharmacist.setPhone("+1-555-0501");
            userRepository.save(pharmacist);
            
            System.out.println("Sample staff created successfully!");
        }

        // Create sample announcements
        createSampleAnnouncements();
    }
    
    private void createSampleAnnouncements() {
        // This would be handled by the AnnouncementService if we had sample data to create
        System.out.println("Announcement system ready for use!");
    }
}