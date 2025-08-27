package com.hmsv1.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vital_signs_logs")
public class VitalSignsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "nurse_id")
    private User nurse;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private Double temperature;

    private String bloodPressure;

    private Integer heartRate;

    private Integer respiratoryRate;

    private LocalDateTime logDateTime;

}
