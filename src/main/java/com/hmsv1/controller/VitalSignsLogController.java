package com.hmsv1.controller;

import com.hmsv1.entity.VitalSignsLog;
import com.hmsv1.service.VitalSignsLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vital-signs")
public class VitalSignsLogController {

    @Autowired
    private VitalSignsLogService vitalSignsLogService;

    @GetMapping
    public List<VitalSignsLog> getAllLogs() {
        return vitalSignsLogService.getAllLogs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VitalSignsLog> getLogById(@PathVariable Long id) {
        Optional<VitalSignsLog> log = vitalSignsLogService.getLogById(id);
        return log.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<VitalSignsLog> getLogsByPatientId(@PathVariable Long patientId) {
        return vitalSignsLogService.getLogsByPatientId(patientId);
    }

    @PostMapping
    public VitalSignsLog createLog(@RequestBody VitalSignsLog log) {
        return vitalSignsLogService.saveLog(log);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VitalSignsLog> updateLog(@PathVariable Long id, @RequestBody VitalSignsLog updatedLog) {
        return vitalSignsLogService.getLogById(id).map(log -> {
            updatedLog.setId(id);
            VitalSignsLog savedLog = vitalSignsLogService.saveLog(updatedLog);
            return ResponseEntity.ok(savedLog);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        vitalSignsLogService.deleteLog(id);
        return ResponseEntity.noContent().build();
    }
}
