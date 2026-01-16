package com.university.smd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.smd.entity.Notification;
import com.university.smd.entity.Syllabus;
import com.university.smd.entity.SyllabusSubscription;
import com.university.smd.entity.User;
import com.university.smd.repository.SyllabusRepository;
import com.university.smd.repository.SyllabusSubscriptionRepository;
import com.university.smd.service.NotificationService;
import com.university.smd.service.UserService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @Autowired
    private SyllabusRepository syllabusRepository;

    @Autowired
    private SyllabusSubscriptionRepository syllabusSubscriptionRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        List<Notification> notifications = notificationService.getUserNotifications(user);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        List<Notification> notifications = notificationService.getUnreadNotifications(user);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        long count = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/subscribe/{syllabusId}")
    public ResponseEntity<?> subscribeToSyllabus(@PathVariable Long syllabusId, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        try {
            User user = userService.getUserByUsername(auth.getName());
            Syllabus syllabus = syllabusRepository.findById(syllabusId)
                    .orElseThrow(() -> new RuntimeException("Syllabus not found"));

            // Check if already subscribed
            if (syllabusSubscriptionRepository.existsByUserAndSyllabus(user, syllabus)) {
                return ResponseEntity.badRequest().body("Already subscribed to this syllabus");
            }

            // Create new subscription
            SyllabusSubscription subscription = new SyllabusSubscription(user, syllabus);
            syllabusSubscriptionRepository.save(subscription);

            return ResponseEntity.ok().body("Successfully subscribed to syllabus");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error subscribing to syllabus: " + e.getMessage());
        }
    }

    @DeleteMapping("/unsubscribe/{syllabusId}")
    public ResponseEntity<?> unsubscribeFromSyllabus(@PathVariable Long syllabusId, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        try {
            User user = userService.getUserByUsername(auth.getName());
            Syllabus syllabus = syllabusRepository.findById(syllabusId)
                    .orElseThrow(() -> new RuntimeException("Syllabus not found"));

            // Find and remove subscription
            SyllabusSubscription subscription = syllabusSubscriptionRepository.findByUserAndSyllabus(user, syllabus)
                    .orElseThrow(() -> new RuntimeException("Subscription not found"));

            syllabusSubscriptionRepository.delete(subscription);

            return ResponseEntity.ok().body("Successfully unsubscribed from syllabus");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error unsubscribing from syllabus: " + e.getMessage());
        }
    }
}