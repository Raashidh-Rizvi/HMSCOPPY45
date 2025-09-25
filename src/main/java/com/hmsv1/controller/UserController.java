package com.hmsv1.controller;

import com.hmsv1.entity.User;
import com.hmsv1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        try {
            return userService.saveUser(user);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Email address is already in use");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> existingUser = userService.getUserById(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setUsername(userDetails.getUsername());
            // Only update password if it's provided
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(userDetails.getPassword());
            }
            user.setRole(userDetails.getRole());
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPhone(userDetails.getPhone());
            try {
                return ResponseEntity.ok(userService.saveUser(user));
            } catch (DataIntegrityViolationException e) {
                throw new RuntimeException("Email address is already in use");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
