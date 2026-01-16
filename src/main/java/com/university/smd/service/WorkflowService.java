package com.university.smd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.smd.entity.Syllabus;
import com.university.smd.entity.User;
import com.university.smd.entity.WorkflowState;
import com.university.smd.repository.SyllabusRepository;
import com.university.smd.repository.WorkflowRepository;

@Service
@Transactional
public class WorkflowService {

    @Autowired
    private SyllabusRepository syllabusRepository;

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private NotificationService notificationService;

    public void transitionStatus(Syllabus syllabus, Syllabus.WorkflowStatus newStatus, 
                               User actor, String comments) {
        Syllabus.WorkflowStatus oldStatus = syllabus.getStatus();
        
        // Validate transition
        if (!isValidTransition(oldStatus, newStatus, actor)) {
            throw new RuntimeException("Invalid status transition");
        }

        // Update syllabus status
        syllabus.setStatus(newStatus);
        syllabusRepository.save(syllabus);

        // Log workflow state change
        WorkflowState workflowState = new WorkflowState(syllabus, oldStatus, newStatus, actor, comments);
        workflowRepository.save(workflowState);

        // Send notifications
        handleStatusChangeNotifications(syllabus, newStatus, actor);
    }

    public void approveSyllabus(Long syllabusId, User approver, String comments) {
        Syllabus syllabus = syllabusRepository.findById(syllabusId)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));

        Syllabus.WorkflowStatus currentStatus = syllabus.getStatus();
        Syllabus.WorkflowStatus nextStatus;

        switch (currentStatus) {
            case PENDING_REVIEW -> nextStatus = Syllabus.WorkflowStatus.PENDING_APPROVAL;
            case PENDING_APPROVAL -> nextStatus = Syllabus.WorkflowStatus.APPROVED;
            default -> throw new RuntimeException("Cannot approve syllabus in current status");
        }

        transitionStatus(syllabus, nextStatus, approver, comments);
    }

    public void rejectSyllabus(Long syllabusId, User rejector, String comments) {
        Syllabus syllabus = syllabusRepository.findById(syllabusId)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));

        if (syllabus.getStatus() != Syllabus.WorkflowStatus.PENDING_REVIEW && 
            syllabus.getStatus() != Syllabus.WorkflowStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Cannot reject syllabus in current status");
        }

        transitionStatus(syllabus, Syllabus.WorkflowStatus.REJECTED, rejector, comments);
    }

    public void publishSyllabus(Long syllabusId, User publisher) {
        Syllabus syllabus = syllabusRepository.findById(syllabusId)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));

        if (syllabus.getStatus() != Syllabus.WorkflowStatus.APPROVED) {
            throw new RuntimeException("Can only publish approved syllabi");
        }

        transitionStatus(syllabus, Syllabus.WorkflowStatus.PUBLISHED, publisher, "Published");
    }

    private boolean isValidTransition(Syllabus.WorkflowStatus from, Syllabus.WorkflowStatus to, User actor) {
        // System admins can perform any transition
        if (actor != null && actor.getRoles() != null && !actor.getRoles().isEmpty()) {
            boolean isAdmin = actor.getRoles().stream()
                .anyMatch(r -> r != null && r.getName() == com.university.smd.entity.Role.RoleName.SYSTEM_ADMIN);
            if (isAdmin) return true;
        }

        // Basic allowed transitions
        boolean basic = (from == Syllabus.WorkflowStatus.PENDING_REVIEW && to == Syllabus.WorkflowStatus.PENDING_APPROVAL)
                || (from == Syllabus.WorkflowStatus.PENDING_APPROVAL && to == Syllabus.WorkflowStatus.APPROVED)
                || (from == Syllabus.WorkflowStatus.APPROVED && to == Syllabus.WorkflowStatus.PUBLISHED)
                || ((from == Syllabus.WorkflowStatus.PENDING_REVIEW || from == Syllabus.WorkflowStatus.PENDING_APPROVAL)
                        && to == Syllabus.WorkflowStatus.REJECTED);
        if (basic) return true;

        // Role-based checks (e.g., HOD can move from REVIEW -> APPROVAL, Academic Affairs can approve)
        if (actor != null && actor.getRoles() != null) {
            boolean isHod = actor.getRoles().stream().anyMatch(r -> r.getName() == com.university.smd.entity.Role.RoleName.HOD);
            boolean isAcademic = actor.getRoles().stream().anyMatch(r -> r.getName() == com.university.smd.entity.Role.RoleName.ACADEMIC_AFFAIRS);
            boolean isPrincipal = actor.getRoles().stream().anyMatch(r -> r.getName() == com.university.smd.entity.Role.RoleName.PRINCIPAL);

            if (from == Syllabus.WorkflowStatus.PENDING_REVIEW && to == Syllabus.WorkflowStatus.PENDING_APPROVAL && isHod) return true;
            if (from == Syllabus.WorkflowStatus.PENDING_APPROVAL && to == Syllabus.WorkflowStatus.APPROVED && isAcademic) return true;
            if (from == Syllabus.WorkflowStatus.APPROVED && to == Syllabus.WorkflowStatus.PUBLISHED && isPrincipal) return true;
        }

        return false;
    }

    private void handleStatusChangeNotifications(Syllabus syllabus, Syllabus.WorkflowStatus newStatus, User actor) {
        switch (newStatus) {
            case PENDING_REVIEW -> notificationService.notifyHoDForReview(syllabus);
            case PENDING_APPROVAL -> notificationService.notifyAcademicAffairsForApproval(syllabus);
            case APPROVED -> notificationService.notifyPrincipalForFinalApproval(syllabus);
            case PUBLISHED -> notificationService.notifyPublished(syllabus);
            case REJECTED -> notificationService.notifyRejected(syllabus, actor);
        }
    }
}