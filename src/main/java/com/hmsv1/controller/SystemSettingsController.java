package com.hmsv1.controller;

import com.hmsv1.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system-settings")
@CrossOrigin(origins = "http://localhost:3000")
public class SystemSettingsController {

    @Autowired
    private SystemSettingsService systemSettingsService;

    @GetMapping("/permissions")
    public ResponseEntity<Map<String, Object>> getPermissions() {
        try {
            Map<String, Object> permissions = systemSettingsService.getPermissions();
            return ResponseEntity.ok(permissions);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of()); // Return empty map if no custom permissions
        }
    }

    @PostMapping("/permissions")
    public ResponseEntity<String> updatePermissions(@RequestBody Map<String, Object> permissions) {
        try {
            systemSettingsService.updatePermissions(permissions);
            return ResponseEntity.ok("Permissions updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating permissions: " + e.getMessage());
        }
    }

    @GetMapping("/general")
    public ResponseEntity<Map<String, Object>> getGeneralSettings() {
        try {
            Map<String, Object> settings = systemSettingsService.getGeneralSettings();
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of()); // Return empty map if no settings
        }
    }

    @PostMapping("/general")
    public ResponseEntity<String> updateGeneralSettings(@RequestBody Map<String, Object> settings) {
        try {
            systemSettingsService.updateGeneralSettings(settings);
            return ResponseEntity.ok("Settings updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating settings: " + e.getMessage());
        }
    }
}