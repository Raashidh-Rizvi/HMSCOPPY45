package com.hmsv1.controller;

import com.hmsv1.dto.LoginRequest;
import com.hmsv1.dto.LoginResponse;
import com.hmsv1.entity.User;
import com.hmsv1.repository.UserRepository;
import com.hmsv1.service.AuthService;
import com.hmsv1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("=== LOGIN ATTEMPT ===");
            System.out.println("Email: " + loginRequest.getEmail());
            System.out.println("Password provided: " + loginRequest.getPassword());

            LoginResponse response = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

            System.out.println("Login successful for: " + loginRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login failed for: " + loginRequest.getEmail());
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new LoginResponse(null, null, "Invalid email or password"));
        }
    }
    @GetMapping("/debug-users")
    public ResponseEntity<List<Map<String, Object>>> debugUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userData = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> data = new HashMap<>();
            data.put("id", user.getId());
            data.put("username", user.getUsername());
            data.put("email", user.getEmail());
            data.put("name", user.getName());
            data.put("role", user.getRole());
            data.put("passwordHash", user.getPassword());
            userData.add(data);
        }

        return ResponseEntity.ok(userData);
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }
}