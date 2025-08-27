package com.hmsv1.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)

    private Role role;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private String phone;



    public enum Role {
        DOCTOR,
        NURSE,
        RECEPTIONIST,
        ADMINISTRATOR,
        PHARMACIST
    }
}
