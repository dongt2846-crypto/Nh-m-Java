package com.university.smd.controller;

import com.university.smd.service.AIJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIIntegrationController {

    @Autowired
    private AIJobService aiJobService;

    @PostMapping("/semantic-diff")
    @PreAuthorize("hasAnyRole('HOD', 'ACADEMIC_AFFAIRS', 'PRINCIPAL')")
    public ResponseEntity<?> requestSemanticDiff(@RequestParam Long syllabus1Id,
                                               @RequestParam Long syllabus2Id) {
        String taskId = aiJobService.requestSemanticDiff(syllabus1Id, syllabus2Id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("taskId", taskId);
        response.put("status", "processing");
        response.put("message", "Semantic diff analysis started");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/summary/{syllabusId}")
    public ResponseEntity<?> requestSummary(@PathVariable Long syllabusId) {
        String taskId = aiJobService.requestSummary(syllabusId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("taskId", taskId);
        response.put("status", "processing");
        response.put("message", "Summary generation started");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/clo-plo-check/{syllabusId}")
    @PreAuthorize("hasAnyRole('HOD', 'ACADEMIC_AFFAIRS', 'PRINCIPAL')")
    public ResponseEntity<?> requestCLOPLOCheck(@PathVariable Long syllabusId) {
        String taskId = aiJobService.requestCLOPLOCheck(syllabusId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("taskId", taskId);
        response.put("status", "processing");
        response.put("message", "CLO-PLO analysis started");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/relation-extract")
    @PreAuthorize("hasAnyRole('ACADEMIC_AFFAIRS', 'PRINCIPAL')")
    public ResponseEntity<?> requestRelationExtract(@RequestParam String department) {
        String taskId = aiJobService.requestRelationExtract(department);
        
        Map<String, Object> response = new HashMap<>();
        response.put("taskId", taskId);
        response.put("status", "processing");
        response.put("message", "Course relation extraction started");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<?> getTaskResult(@PathVariable String taskId) {
        Object result = aiJobService.getTaskResult(taskId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/ocr")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<?> requestOCR(@RequestParam String fileData,
                                      @RequestParam String fileType) {
        String taskId = aiJobService.requestOCR(fileData, fileType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("taskId", taskId);
        response.put("status", "processing");
        response.put("message", "OCR processing started");
        
        return ResponseEntity.ok(response);
    }
}