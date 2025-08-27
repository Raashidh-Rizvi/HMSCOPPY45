package com.hmsv1.controller;

import com.hmsv1.entity.Billing;
import com.hmsv1.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/billings")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @GetMapping
    public List<Billing> getAllBills() {
        return billingService.getAllBills();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Billing> getBillById(@PathVariable Long id) {
        Optional<Billing> bill = billingService.getBillById(id);
        return bill.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Billing> getBillsByPatientId(@PathVariable Long patientId) {
        return billingService.getBillsByPatientId(patientId);
    }

    @PostMapping
    public Billing createBill(@RequestBody Billing billing) {
        return billingService.saveBill(billing);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Billing> updateBill(@PathVariable Long id, @RequestBody Billing updatedBill) {
        return billingService.getBillById(id).map(bill -> {
            updatedBill.setId(id);
            Billing savedBill = billingService.saveBill(updatedBill);
            return ResponseEntity.ok(savedBill);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        billingService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }
}
