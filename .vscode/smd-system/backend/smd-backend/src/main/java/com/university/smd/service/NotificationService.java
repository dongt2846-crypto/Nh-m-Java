package com.university.smd.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.smd.entity.Notification;
import com.university.smd.entity.Role;
import com.university.smd.entity.Syllabus;
import com.university.smd.entity.User;
import com.university.smd.repository.NotificationRepository;
import com.university.smd.repository.UserRepository;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void notifyHoDForReview(Syllabus syllabus) {
        List<User> hods = userRepository.findByRoleName(Role.RoleName.HOD);
        String title = "New Syllabus for Review";
        String message = String.format("Syllabus '%s' has been submitted for review",
                                     syllabus.getCourseName());

        for (User hod : hods) {
            createNotification(hod, title, message, Notification.NotificationType.SYLLABUS_SUBMITTED);
        }
    }

    public void notifyAcademicAffairsForApproval(Syllabus syllabus) {
        List<User> academicAffairs = userRepository.findByRoleName(Role.RoleName.ACADEMIC_AFFAIRS);
        String title = "Syllabus Approved by HoD";
        String message = String.format("Syllabus '%s' has been approved by HoD and needs final approval",
                                     syllabus.getCourseName());

        for (User user : academicAffairs) {
            createNotification(user, title, message, Notification.NotificationType.SYLLABUS_APPROVED);
        }
    }

    public void notifyPrincipalForFinalApproval(Syllabus syllabus) {
        List<User> principals = userRepository.findByRoleName(Role.RoleName.PRINCIPAL);
        String title = "Syllabus Ready for Final Approval";
        String message = String.format("Syllabus '%s' has been approved and is ready for publication",
                                     syllabus.getCourseName());

        for (User principal : principals) {
            createNotification(principal, title, message, Notification.NotificationType.SYLLABUS_APPROVED);
        }
    }

    public void notifyPublished(Syllabus syllabus) {
        // Notify creator
        String title = "Syllabus Published";
        String message = String.format("Your syllabus '%s' has been published", 
                                     syllabus.getCourseName());
        createNotification(syllabus.getCreatedBy(), title, message, 
                         Notification.NotificationType.SYLLABUS_PUBLISHED);

        // Notify students (if needed)
        List<User> students = userRepository.findByRoleName(Role.RoleName.STUDENT);
        for (User student : students) {
            createNotification(student, "New Syllabus Available", message,
                             Notification.NotificationType.SYLLABUS_PUBLISHED);
        }
    }

    public void notifyRejected(Syllabus syllabus, User rejector) {
        String title = "Syllabus Rejected";
        String message = String.format("Your syllabus '%s' has been rejected. Please review and resubmit.", 
                                     syllabus.getCourseName());
        createNotification(syllabus.getCreatedBy(), title, message, 
                         Notification.NotificationType.SYLLABUS_REJECTED);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    private void createNotification(User user, String title, String message, 
                                  Notification.NotificationType type) {
        Notification notification = new Notification(user, title, message, type);
        notificationRepository.save(notification);

        // Send real-time notification via Redis
        sendRealTimeNotification(user.getId(), notification);
    }

    private void sendRealTimeNotification(Long userId, Notification notification) {
        String channel = "notifications:" + userId;
        redisTemplate.convertAndSend(channel, notification);
    }
}