package com.hmsv1.service;

import com.hmsv1.entity.HospitalMetric;
import com.hmsv1.repository.HospitalMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalMetricService {

    @Autowired
    private HospitalMetricRepository hospitalMetricRepository;

    public List<HospitalMetric> getAllMetrics() {
        return hospitalMetricRepository.findAll();
    }

    public Optional<HospitalMetric> getMetricById(Long id) {
        return hospitalMetricRepository.findById(id);
    }

    public HospitalMetric saveMetric(HospitalMetric metric) {
        return hospitalMetricRepository.save(metric);
    }

    public void deleteMetric(Long id) {
        hospitalMetricRepository.deleteById(id);
    }
}
