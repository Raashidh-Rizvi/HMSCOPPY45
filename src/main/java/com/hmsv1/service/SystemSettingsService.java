package com.hmsv1.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class SystemSettingsService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String PERMISSIONS_FILE = "system-permissions.json";
    private final String SETTINGS_FILE = "system-settings.json";

    public Map<String, Object> getPermissions() {
        try {
            File file = new File(PERMISSIONS_FILE);
            if (file.exists()) {
                return objectMapper.readValue(file, new TypeReference<Map<String, Object>>() {});
            }
        } catch (IOException e) {
            System.err.println("Error reading permissions file: " + e.getMessage());
        }
        return new HashMap<>();
    }

    public void updatePermissions(Map<String, Object> permissions) {
        try {
            objectMapper.writeValue(new File(PERMISSIONS_FILE), permissions);
        } catch (IOException e) {
            throw new RuntimeException("Error saving permissions: " + e.getMessage());
        }
    }

    public Map<String, Object> getGeneralSettings() {
        try {
            File file = new File(SETTINGS_FILE);
            if (file.exists()) {
                return objectMapper.readValue(file, new TypeReference<Map<String, Object>>() {});
            }
        } catch (IOException e) {
            System.err.println("Error reading settings file: " + e.getMessage());
        }
        return new HashMap<>();
    }

    public void updateGeneralSettings(Map<String, Object> settings) {
        try {
            objectMapper.writeValue(new File(SETTINGS_FILE), settings);
        } catch (IOException e) {
            throw new RuntimeException("Error saving settings: " + e.getMessage());
        }
    }
}