package com.hmsv1.controller;

import com.hmsv1.entity.HospitalMetric;
import com.hmsv1.service.HospitalMetricService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/metrics")
public class HospitalMetricController {

    @Autowired
    private HospitalMetricService hospitalMetricService;

    @GetMapping
    public List<HospitalMetric> getAllMetrics() {
        return hospitalMetricService.getAllMetrics();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalMetric> getMetricById(@PathVariable Long id) {
        Optional<HospitalMetric> metric = hospitalMetricService.getMetricById(id);
        return metric.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public HospitalMetric createMetric(@RequestBody HospitalMetric metric) {
        return hospitalMetricService.saveMetric(metric);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HospitalMetric> updateMetric(@PathVariable Long id, @RequestBody HospitalMetric updatedMetric) {
        return hospitalMetricService.getMetricById(id).map(metric -> {
            updatedMetric.setId(id);
            HospitalMetric savedMetric = hospitalMetricService.saveMetric(updatedMetric);
            return ResponseEntity.ok(savedMetric);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetric(@PathVariable Long id) {
        hospitalMetricService.deleteMetric(id);
        return ResponseEntity.noContent().build();
    }
}
