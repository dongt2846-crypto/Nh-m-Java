package com.university.smd.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.university.smd.dto.SyllabusRequest;
import com.university.smd.dto.SyllabusResponse;
import com.university.smd.entity.Syllabus;
import com.university.smd.entity.User;
import com.university.smd.service.SyllabusService;
import com.university.smd.service.UserService;
import com.university.smd.service.WorkflowService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/syllabi")
@CrossOrigin(origins = "*")
public class SyllabusController {

    @Autowired
    private SyllabusService syllabusService;

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<SyllabusResponse> createSyllabus(@Valid @RequestBody SyllabusRequest request,
                                                          Authentication auth) {
        User creator = userService.getUserByUsername(auth.getName());
        if (creator == null) {
            return ResponseEntity.badRequest().build();
        }

        Syllabus syllabus = new Syllabus();
        syllabus.setCourseCode(request.getCourseCode());
        syllabus.setCourseName(request.getCourseName());
        syllabus.setDepartment(request.getDepartment());
        syllabus.setCredits(request.getCredits());
        syllabus.setSemester(request.getSemester());
        syllabus.setAcademicYear(request.getAcademicYear());
        syllabus.setDescription(request.getDescription());
        syllabus.setObjectives(request.getObjectives());
        syllabus.setPrerequisites(request.getPrerequisites());
        syllabus.setAssessmentMethods(request.getAssessmentMethods());
        syllabus.setTextbooks(request.getTextbooks());
        syllabus.setReferences(request.getReferences());

        Syllabus createdSyllabus = syllabusService.createSyllabus(syllabus, creator);
        return ResponseEntity.ok(new SyllabusResponse(createdSyllabus));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<SyllabusResponse> updateSyllabus(@PathVariable Long id,
                                                          @Valid @RequestBody SyllabusRequest request,
                                                          Authentication auth) {
        User updater = userService.getUserByUsername(auth.getName());
        if (updater == null) {
            return ResponseEntity.badRequest().build();
        }

        Syllabus syllabusDetails = new Syllabus();
        syllabusDetails.setCourseName(request.getCourseName());
        syllabusDetails.setDescription(request.getDescription());
        syllabusDetails.setObjectives(request.getObjectives());
        syllabusDetails.setPrerequisites(request.getPrerequisites());
        syllabusDetails.setAssessmentMethods(request.getAssessmentMethods());
        syllabusDetails.setTextbooks(request.getTextbooks());
        syllabusDetails.setReferences(request.getReferences());
        syllabusDetails.setCredits(request.getCredits());
        syllabusDetails.setSemester(request.getSemester());
        syllabusDetails.setAcademicYear(request.getAcademicYear());

        Syllabus updatedSyllabus = syllabusService.updateSyllabus(id, syllabusDetails, updater);
        return ResponseEntity.ok(new SyllabusResponse(updatedSyllabus));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<?> submitForReview(@PathVariable Long id, Authentication auth) {
        User submitter = userService.getUserByUsername(auth.getName());
        syllabusService.submitForReview(id, submitter);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Syllabus submitted for review");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('HOD', 'ACADEMIC_AFFAIRS', 'PRINCIPAL')")
    public ResponseEntity<?> approveSyllabus(@PathVariable Long id,
                                           @RequestParam(required = false) String comments,
                                           Authentication auth) {
        User approver = userService.getUserByUsername(auth.getName());
        if (approver == null) {
            return ResponseEntity.badRequest().build();
        }
        workflowService.approveSyllabus(id, approver, comments);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Syllabus approved");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('HOD', 'ACADEMIC_AFFAIRS', 'PRINCIPAL')")
    public ResponseEntity<?> rejectSyllabus(@PathVariable Long id,
                                          @RequestParam String comments,
                                          Authentication auth) {
        User rejector = userService.getUserByUsername(auth.getName());
        if (rejector == null) {
            return ResponseEntity.badRequest().build();
        }
        workflowService.rejectSyllabus(id, rejector, comments);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Syllabus rejected");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> publishSyllabus(@PathVariable Long id, Authentication auth) {
        User publisher = userService.getUserByUsername(auth.getName());
        if (publisher == null) {
            return ResponseEntity.badRequest().build();
        }
        workflowService.publishSyllabus(id, publisher);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Syllabus published");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SyllabusResponse>> getAllSyllabi(@RequestParam(required = false) String status) {
        List<Syllabus> syllabi;
        
        if (status != null) {
            syllabi = syllabusService.getSyllabiByStatus(Syllabus.WorkflowStatus.valueOf(status));
        } else {
            syllabi = syllabusService.getSyllabiByStatus(Syllabus.WorkflowStatus.PUBLISHED);
        }
        
        List<SyllabusResponse> response = syllabi.stream()
                .map(SyllabusResponse::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SyllabusResponse> getSyllabusById(@PathVariable Long id) {
        Syllabus syllabus = syllabusService.getSyllabusById(id);
        return ResponseEntity.ok(new SyllabusResponse(syllabus));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<List<SyllabusResponse>> getMySyllabi(Authentication auth) {
        User creator = userService.getUserByUsername(auth.getName());
        if (creator == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Syllabus> syllabi = syllabusService.getSyllabiByCreator(creator);

        List<SyllabusResponse> response = syllabi.stream()
                .map(SyllabusResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending-review")
    @PreAuthorize("hasAnyRole('HOD', 'ACADEMIC_AFFAIRS', 'PRINCIPAL')")
    public ResponseEntity<List<SyllabusResponse>> getPendingReview() {
        List<Syllabus> syllabi = syllabusService.getSyllabiForReview("");
        
        List<SyllabusResponse> response = syllabi.stream()
                .map(SyllabusResponse::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SyllabusResponse>> searchSyllabi(@RequestParam String keyword) {
        List<Syllabus> syllabi = syllabusService.searchSyllabi(keyword);
        
        List<SyllabusResponse> response = syllabi.stream()
                .map(SyllabusResponse::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
}