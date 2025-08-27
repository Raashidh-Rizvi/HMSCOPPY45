package com.hmsv1.service;

import com.hmsv1.entity.VitalSignsLog;
import com.hmsv1.repository.VitalSignsLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VitalSignsLogService {

    @Autowired
    private VitalSignsLogRepository vitalSignsLogRepository;

    public List<VitalSignsLog> getAllLogs() {
        return vitalSignsLogRepository.findAll();
    }

    public Optional<VitalSignsLog> getLogById(Long id) {
        return vitalSignsLogRepository.findById(id);
    }

    public List<VitalSignsLog> getLogsByPatientId(Long patientId) {
        return vitalSignsLogRepository.findByPatientId(patientId);
    }

    public VitalSignsLog saveLog(VitalSignsLog log) {
        return vitalSignsLogRepository.save(log);
    }

    public void deleteLog(Long id) {
        vitalSignsLogRepository.deleteById(id);
    }
}
