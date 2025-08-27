package com.hmsv1.entity;

import com.hmsv1.entity.Patient;
import com.hmsv1.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "medication_prescriptions")
public class MedicationPrescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(optional = false)
    @JoinColumn(name = "doctor_id")
    private User doctor;

    private String medicationName;

    private String dosage;

    private String frequency;

    private LocalDate startDate;

    private LocalDate endDate;

}
