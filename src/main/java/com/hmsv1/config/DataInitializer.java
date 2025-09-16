package com.hmsv1.config;

import com.hmsv1.entity.User;
import com.hmsv1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

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

    }
}