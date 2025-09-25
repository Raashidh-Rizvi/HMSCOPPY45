package com.hmsv1.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Column(nullable = false)
    private String createdBy;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    @ElementCollection
    @CollectionTable(name = "announcement_target_roles", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "role")
    private List<String> targetRoles;

    @Column(nullable = false)
    private Boolean read = false;

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (read == null) {
            read = false;
        }
    }
}