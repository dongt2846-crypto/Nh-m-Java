package com.university.smd.controller;

import com.university.smd.entity.User;
import com.university.smd.service.UserService;
import com.university.smd.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/workflow")
@CrossOrigin(origins = "*")
public class WorkflowController {

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private UserService userService;

    @PostMapping("/syllabi/{id}/approve")
    @PreAuthorize("hasAnyRole('HOD', 'ACADEMIC_AFFAIRS', 'PRINCIPAL')")
    public ResponseEntity<?> approveSyllabus(@PathVariable Long id,
                                           @RequestParam(required = false) String comments,
                                           Authentication auth) {
        User approver = userService.getUserByUsername(auth.getName());
        workflowService.approveSyllabus(id, approver, comments);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Syllabus approved successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/syllabi/{id}/reject")
    @PreAuthorize("hasAnyRole('HOD', 'ACADEMIC_AFFAIRS', 'PRINCIPAL')")
    public ResponseEntity<?> rejectSyllabus(@PathVariable Long id,
                                          @RequestParam String comments,
                                          Authentication auth) {
        User rejector = userService.getUserByUsername(auth.getName());
        workflowService.rejectSyllabus(id, rejector, comments);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Syllabus rejected");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/syllabi/{id}/publish")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> publishSyllabus(@PathVariable Long id, Authentication auth) {
        User publisher = userService.getUserByUsername(auth.getName());
        workflowService.publishSyllabus(id, publisher);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Syllabus published successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/syllabi/{id}/history")
    public ResponseEntity<?> getWorkflowHistory(@PathVariable Long id) {
        try {
            // Implementation to get workflow history
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving workflow history");
        }
    }

    @PostMapping("/syllabi/{id}/collaborative-review")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> startCollaborativeReview(@PathVariable Long id,
                                                    @RequestParam int durationDays,
                                                    Authentication auth) {
        try {
            // Implementation for collaborative review
            Map<String, String> response = new HashMap<>();
            response.put("message", "Collaborative review started");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error starting collaborative review");
        }
    }
}