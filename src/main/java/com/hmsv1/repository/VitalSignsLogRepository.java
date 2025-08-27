package com.hmsv1.repository;

import com.hmsv1.entity.VitalSignsLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VitalSignsLogRepository extends JpaRepository<VitalSignsLog, Long> {
    List<VitalSignsLog> findByPatientId(Long patientId);
}
