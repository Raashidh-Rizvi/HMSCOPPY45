package com.hmsv1.service;

import com.hmsv1.entity.Billing;
import com.hmsv1.repository.BillingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    public List<Billing> getAllBills() {
        return billingRepository.findAll();
    }

    public Optional<Billing> getBillById(Long id) {
        return billingRepository.findById(id);
    }

    public List<Billing> getBillsByPatientId(Long patientId) {
        return billingRepository.findByPatientId(patientId);
    }

    public Billing saveBill(Billing billing) {
        return billingRepository.save(billing);
    }

    public void deleteBill(Long id) {
        billingRepository.deleteById(id);
    }
}
