package com.hmsv1.repository;

import com.hmsv1.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    @Query("SELECT a FROM Announcement a WHERE a.expiresAt IS NULL OR a.expiresAt > :now ORDER BY a.createdAt DESC")
    List<Announcement> findActiveAnnouncements(@Param("now") LocalDateTime now);
    
    @Query("SELECT a FROM Announcement a WHERE (a.expiresAt IS NULL OR a.expiresAt > :now) AND ('ALL' MEMBER OF a.targetRoles OR :role MEMBER OF a.targetRoles) ORDER BY a.createdAt DESC")
    List<Announcement> findActiveAnnouncementsForRole(@Param("now") LocalDateTime now, @Param("role") String role);
}