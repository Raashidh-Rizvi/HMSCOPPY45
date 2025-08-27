package com.hmsv1.service;

import com.hmsv1.entity.PatientRecord;
import com.hmsv1.repository.PatientRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientRecordService {

    @Autowired
    private PatientRecordRepository patientRecordRepository;

    public List<PatientRecord> getAllRecords() {
        return patientRecordRepository.findAll();
    }

    public Optional<PatientRecord> getRecordById(Long id) {
        return patientRecordRepository.findById(id);
    }

    public List<PatientRecord> getRecordsByPatientId(Long patientId) {
        return patientRecordRepository.findByPatientId(patientId);
    }

    public PatientRecord saveRecord(PatientRecord record) {
        return patientRecordRepository.save(record);
    }

    public void deleteRecord(Long id) {
        patientRecordRepository.deleteById(id);
    }
}
