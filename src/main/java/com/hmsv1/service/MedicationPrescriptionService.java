package com.hmsv1.service;

import com.hmsv1.entity.MedicationPrescription;
import com.hmsv1.repository.MedicationPrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicationPrescriptionService {

    @Autowired
    private MedicationPrescriptionRepository prescriptionRepository;

    public List<MedicationPrescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<MedicationPrescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public List<MedicationPrescription> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public MedicationPrescription savePrescription(MedicationPrescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}
