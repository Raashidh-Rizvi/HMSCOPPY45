package com.hmsv1.service;

import com.hmsv1.entity.Feedback;
import com.hmsv1.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAllOrderByCreatedAtDesc();
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    public List<Feedback> getFeedbacksByUserId(Long userId) {
        return feedbackRepository.findByUserId(userId);
    }

    public List<Feedback> getFeedbacksByType(Feedback.Type type) {
        return feedbackRepository.findByType(type);
    }

    public List<Feedback> getFeedbacksByStatus(Feedback.Status status) {
        return feedbackRepository.findByStatus(status);
    }

    public Feedback saveFeedback(Feedback feedback) {
        if (feedback.getCreatedAt() == null) {
            feedback.setCreatedAt(LocalDateTime.now());
        }
        return feedbackRepository.save(feedback);
    }

    public Feedback updateFeedbackStatus(Long id, Feedback.Status status, String adminResponse) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(id);
        if (feedbackOpt.isPresent()) {
            Feedback feedback = feedbackOpt.get();
            feedback.setStatus(status);
            if (adminResponse != null) {
                feedback.setAdminResponse(adminResponse);
            }
            if (status == Feedback.Status.RESOLVED || status == Feedback.Status.CLOSED) {
                feedback.setResolvedAt(LocalDateTime.now());
            }
            return feedbackRepository.save(feedback);
        }
        throw new RuntimeException("Feedback not found");
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}