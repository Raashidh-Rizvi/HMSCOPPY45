package com.hmsv1.service;

import com.hmsv1.entity.Announcement;
import com.hmsv1.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findActiveAnnouncements(LocalDateTime.now());
    }

    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    public List<Announcement> getAnnouncementsForRole(String role) {
        return announcementRepository.findActiveAnnouncementsForRole(LocalDateTime.now(), role);
    }

    public Announcement saveAnnouncement(Announcement announcement) {
        if (announcement.getCreatedAt() == null) {
            announcement.setCreatedAt(LocalDateTime.now());
        }
        return announcementRepository.save(announcement);
    }

    public void markAsRead(Long id) {
        Optional<Announcement> announcement = announcementRepository.findById(id);
        if (announcement.isPresent()) {
            Announcement ann = announcement.get();
            ann.setRead(true);
            announcementRepository.save(ann);
        }
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}