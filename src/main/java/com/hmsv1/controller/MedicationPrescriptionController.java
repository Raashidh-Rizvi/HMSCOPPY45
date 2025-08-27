package com.hmsv1.controller;

import com.hmsv1.entity.MedicationPrescription;
import com.hmsv1.service.MedicationPrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
public class MedicationPrescriptionController {

    @Autowired
    private MedicationPrescriptionService prescriptionService;

    @GetMapping
    public List<MedicationPrescription> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicationPrescription> getPrescriptionById(@PathVariable Long id) {
        Optional<MedicationPrescription> prescription = prescriptionService.getPrescriptionById(id);
        return prescription.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicationPrescription> getPrescriptionsByPatient(@PathVariable Long patientId) {
        return prescriptionService.getPrescriptionsByPatientId(patientId);
    }

    @PostMapping
    public MedicationPrescription createPrescription(@RequestBody MedicationPrescription prescription) {
        return prescriptionService.savePrescription(prescription);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicationPrescription> updatePrescription(@PathVariable Long id, @RequestBody MedicationPrescription prescriptionDetails) {
        Optional<MedicationPrescription> existingPrescription = prescriptionService.getPrescriptionById(id);
        if (existingPrescription.isPresent()) {
            MedicationPrescription prescription = existingPrescription.get();
            prescription.setMedicationName(prescriptionDetails.getMedicationName());
            prescription.setDosage(prescriptionDetails.getDosage());
            prescription.setFrequency(prescriptionDetails.getFrequency());
            prescription.setStartDate(prescriptionDetails.getStartDate());
            prescription.setEndDate(prescriptionDetails.getEndDate());
            return ResponseEntity.ok(prescriptionService.savePrescription(prescription));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
}
