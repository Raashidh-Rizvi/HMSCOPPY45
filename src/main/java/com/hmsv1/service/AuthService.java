package com.hmsv1.service;

import com.hmsv1.dto.LoginResponse;
import com.hmsv1.dto.UserDto;
import com.hmsv1.entity.User;
import com.hmsv1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse authenticate(String email, String password) {
        System.out.println("=== AUTHENTICATION ATTEMPT ===");
        System.out.println("Email: " + email);

        // Try multiple ways to find the user
        Optional<User> userOpt = findUserByAnyMethod(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            System.out.println("User found:");
            System.out.println("  ID: " + user.getId());
            System.out.println("  Username: " + user.getUsername());
            System.out.println("  Email: " + user.getEmail());
            System.out.println("  Name: " + user.getName());
            System.out.println("  Role: " + user.getRole());
            System.out.println("  Password Hash: " + user.getPassword());

            // Test password matching
            boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
            System.out.println("Password matches: " + passwordMatches);

            if (passwordMatches) {
                String token = UUID.randomUUID().toString();
                UserDto userDto = mapUserToDto(user);

                System.out.println("Authentication successful! Token: " + token);
                return new LoginResponse(token, userDto, "Login successful");
            }
        }

        System.out.println("Authentication failed - no user found or password mismatch");
        throw new RuntimeException("Invalid email or password");
    }

    private Optional<User> findUserByAnyMethod(String identifier) {
        // Try email first
        Optional<User> user = userRepository.findByEmail(identifier);
        if (user.isPresent()) {
            System.out.println("Found user by email: " + identifier);
            return user;
        }

        // Try username
        user = userRepository.findByUsername(identifier);
        if (user.isPresent()) {
            System.out.println("Found user by username: " + identifier);
            return user;
        }

        System.out.println("No user found with identifier: " + identifier);
        return Optional.empty();
    }

    private UserDto mapUserToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole().toString());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        // DO NOT include password
        return userDto;
    }
}