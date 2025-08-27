package com.hmsv1.controller;

import com.hmsv1.entity.PatientRecord;
import com.hmsv1.service.PatientRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patient-records")
public class PatientRecordController {

    @Autowired
    private PatientRecordService patientRecordService;

    @GetMapping
    public List<PatientRecord> getAllRecords() {
        return patientRecordService.getAllRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientRecord> getRecordById(@PathVariable Long id) {
        Optional<PatientRecord> record = patientRecordService.getRecordById(id);
        return record.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<PatientRecord> getRecordsByPatientId(@PathVariable Long patientId) {
        return patientRecordService.getRecordsByPatientId(patientId);
    }

    @PostMapping
    public PatientRecord createRecord(@RequestBody PatientRecord record) {
        return patientRecordService.saveRecord(record);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientRecord> updateRecord(@PathVariable Long id, @RequestBody PatientRecord recordDetails) {
        Optional<PatientRecord> existingRecord = patientRecordService.getRecordById(id);
        if (existingRecord.isPresent()) {
            PatientRecord record = existingRecord.get();
            record.setDiagnosis(recordDetails.getDiagnosis());
            record.setTreatmentPlan(recordDetails.getTreatmentPlan());
            record.setRecordDate(recordDetails.getRecordDate());
            return ResponseEntity.ok(patientRecordService.saveRecord(record));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        patientRecordService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
