package com.hmsv1.controller;

import com.hmsv1.entity.Feedback;
import com.hmsv1.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
        return feedback.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbacksByUserId(@PathVariable Long userId) {
        return feedbackService.getFeedbacksByUserId(userId);
    }

    @GetMapping("/type/{type}")
    public List<Feedback> getFeedbacksByType(@PathVariable Feedback.Type type) {
        return feedbackService.getFeedbacksByType(type);
    }

    @GetMapping("/status/{status}")
    public List<Feedback> getFeedbacksByStatus(@PathVariable Feedback.Status status) {
        return feedbackService.getFeedbacksByStatus(status);
    }

    @PostMapping
    public Feedback createFeedback(@RequestBody Feedback feedback) {
        return feedbackService.saveFeedback(feedback);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long id, @RequestBody Feedback feedbackDetails) {
        Optional<Feedback> existingFeedback = feedbackService.getFeedbackById(id);
        if (existingFeedback.isPresent()) {
            Feedback feedback = existingFeedback.get();
            feedback.setTitle(feedbackDetails.getTitle());
            feedback.setContent(feedbackDetails.getContent());
            feedback.setType(feedbackDetails.getType());
            feedback.setPriority(feedbackDetails.getPriority());
            return ResponseEntity.ok(feedbackService.saveFeedback(feedback));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Feedback> updateFeedbackStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusUpdate) {
        try {
            Feedback.Status status = Feedback.Status.valueOf(statusUpdate.get("status"));
            String adminResponse = statusUpdate.get("adminResponse");
            Feedback updatedFeedback = feedbackService.updateFeedbackStatus(id, status, adminResponse);
            return ResponseEntity.ok(updatedFeedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}