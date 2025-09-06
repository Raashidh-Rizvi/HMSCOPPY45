package com.hmsv1.service;

import com.hmsv1.dto.LoginResponse;
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
    public LoginResponse authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Use BCrypt password verification
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = UUID.randomUUID().toString();
                return new LoginResponse(token, user, "Login successful");
            }
        }
        
        throw new RuntimeException("Invalid credentials");
    }
}