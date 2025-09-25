package com.hmsv1.repository;

import com.hmsv1.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    List<Feedback> findByUserId(Long userId);
    
    List<Feedback> findByType(Feedback.Type type);
    
    List<Feedback> findByStatus(Feedback.Status status);
    
    @Query("SELECT f FROM Feedback f WHERE f.type = :type AND f.status = :status ORDER BY f.createdAt DESC")
    List<Feedback> findByTypeAndStatus(@Param("type") Feedback.Type type, @Param("status") Feedback.Status status);
    
    @Query("SELECT f FROM Feedback f ORDER BY f.createdAt DESC")
    List<Feedback> findAllOrderByCreatedAtDesc();
}