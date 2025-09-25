package com.hmsv1.controller;

import com.hmsv1.entity.Announcement;
import com.hmsv1.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:3000")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping
    public List<Announcement> getAllAnnouncements() {
        return announcementService.getAllAnnouncements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable Long id) {
        Optional<Announcement> announcement = announcementService.getAnnouncementById(id);
        return announcement.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Announcement createAnnouncement(@RequestBody Announcement announcement) {
        return announcementService.saveAnnouncement(announcement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(@PathVariable Long id, @RequestBody Announcement announcementDetails) {
        Optional<Announcement> existingAnnouncement = announcementService.getAnnouncementById(id);
        if (existingAnnouncement.isPresent()) {
            Announcement announcement = existingAnnouncement.get();
            announcement.setTitle(announcementDetails.getTitle());
            announcement.setContent(announcementDetails.getContent());
            announcement.setPriority(announcementDetails.getPriority());
            announcement.setTargetRoles(announcementDetails.getTargetRoles());
            announcement.setExpiresAt(announcementDetails.getExpiresAt());
            return ResponseEntity.ok(announcementService.saveAnnouncement(announcement));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        try {
            announcementService.markAsRead(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}