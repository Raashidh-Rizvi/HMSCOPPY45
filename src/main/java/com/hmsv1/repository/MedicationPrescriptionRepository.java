package com.hmsv1.repository;

import com.hmsv1.entity.MedicationPrescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicationPrescriptionRepository extends JpaRepository<MedicationPrescription, Long> {
    List<MedicationPrescription> findByPatientId(Long patientId);
}
