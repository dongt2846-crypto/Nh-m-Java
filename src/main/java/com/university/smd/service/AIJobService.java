package com.university.smd.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;  

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AIJobService {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final Logger logger = LoggerFactory.getLogger(AIJobService.class);

    public String requestSemanticDiff(Long syllabus1Id, Long syllabus2Id) {
        String taskId = generateTaskId();
        
        Map<String, Object> request = new HashMap<>();
        request.put("syllabus1Id", syllabus1Id);
        request.put("syllabus2Id", syllabus2Id);
        request.put("taskId", taskId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        try {
            restTemplate.postForObject(aiServiceUrl + "/api/semantic-diff/compare", entity, Object.class);
        } catch (RestClientException e) {
            // Log error and handle gracefully
            logger.error("Error calling AI service /api/semantic-diff/compare: {}", e.getMessage(), e);
        }
        
        return taskId;
    }

    public String requestSummary(Long syllabusId) {
        String taskId = generateTaskId();
        
        Map<String, Object> request = new HashMap<>();
        request.put("syllabusId", syllabusId);
        request.put("taskId", taskId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        try {
            restTemplate.postForObject(aiServiceUrl + "/api/summary/generate", entity, Object.class);
        } catch (RestClientException e) {
            logger.error("Error calling AI service /api/summary/generate: {}", e.getMessage(), e);
        }
        
        return taskId;
    }

    public String requestCLOPLOCheck(Long syllabusId) {
        String taskId = generateTaskId();
        
        Map<String, Object> request = new HashMap<>();
        request.put("syllabusId", syllabusId);
        request.put("taskId", taskId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        try {
            restTemplate.postForObject(aiServiceUrl + "/api/clo-plo-check/analyze", entity, Object.class);
        } catch (RestClientException e) {
            logger.error("Error calling AI service /api/clo-plo-check/analyze: {}", e.getMessage(), e);
        }
        
        return taskId;
    }

    public String requestRelationExtract(String department) {
        String taskId = generateTaskId();
        
        Map<String, Object> request = new HashMap<>();
        request.put("department", department);
        request.put("taskId", taskId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        try {
            restTemplate.postForObject(aiServiceUrl + "/api/relation-extract/extract", entity, Object.class);
        } catch (RestClientException e) {
            logger.error("Error calling AI service /api/relation-extract/extract: {}", e.getMessage(), e);
        }
        
        return taskId;
    }

    public String requestOCR(String fileData, String fileType) {
        String taskId = generateTaskId();
        
        Map<String, Object> request = new HashMap<>();
        request.put("file_data", fileData);
        request.put("file_type", fileType);
        request.put("taskId", taskId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        try {
            restTemplate.postForObject(aiServiceUrl + "/api/ocr/extract-text", entity, Object.class);
        } catch (RestClientException e) {
            logger.error("Error calling AI service /api/ocr/extract-text: {}", e.getMessage(), e);
        }
        
        return taskId;
    }

    public Object getTaskResult(String taskId) {
        try {
            // Try different AI service endpoints to get result
            String[] endpoints = {
                "/api/semantic-diff/result/" + taskId,
                "/api/summary/result/" + taskId,
                "/api/clo-plo-check/result/" + taskId,
                "/api/relation-extract/result/" + taskId,
                "/api/ocr/result/" + taskId
            };
            
            for (String endpoint : endpoints) {
                try {
                    Object result = restTemplate.getForObject(aiServiceUrl + endpoint, Object.class);
                    if (result != null) {
                        return result;
                    }
                } catch (RestClientException e) {
                    // Endpoint may not exist for this task type; log and continue to next endpoint
                    logger.debug("AI endpoint {} returned no result or failed: {}", endpoint, e.getMessage());
                }
            }
            
            // Return pending status if no result found
            Map<String, String> response = new HashMap<>();
            response.put("status", "processing");
            response.put("message", "Task is still being processed");
            return response;
            
        } catch (RestClientException e) {
            logger.error("Error retrieving task result: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error retrieving task result: " + e.getMessage());
            return response;
        }
    }

    private String generateTaskId() {
        return UUID.randomUUID().toString();
    }
}