package com.university.smd.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.smd.entity.Syllabus;
import com.university.smd.entity.SyllabusVersion;
import com.university.smd.entity.User;
import com.university.smd.repository.SyllabusRepository;
import com.university.smd.repository.SyllabusVersionRepository;

@Service
@Transactional
public class SyllabusService {

    @Autowired
    private SyllabusRepository syllabusRepository;

    @Autowired
    private SyllabusVersionRepository syllabusVersionRepository;

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private NotificationService notificationService;

    public Syllabus createSyllabus(Syllabus syllabus, User creator) {
        syllabus.setCreatedBy(creator);
        syllabus.setStatus(Syllabus.WorkflowStatus.DRAFT);
        Syllabus savedSyllabus = syllabusRepository.save(syllabus);

        // Create initial version
        createVersion(savedSyllabus, "1.0", "Initial version", creator);

        return savedSyllabus;
    }

    public Syllabus updateSyllabus(Long id, Syllabus syllabusDetails, User updater) {
        Syllabus syllabus = syllabusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));

        // Only allow updates if in DRAFT or REJECTED status
        if (syllabus.getStatus() != Syllabus.WorkflowStatus.DRAFT && 
            syllabus.getStatus() != Syllabus.WorkflowStatus.REJECTED) {
            throw new RuntimeException("Cannot update syllabus in current status");
        }

        syllabus.setCourseName(syllabusDetails.getCourseName());
        syllabus.setDescription(syllabusDetails.getDescription());
        syllabus.setObjectives(syllabusDetails.getObjectives());
        syllabus.setPrerequisites(syllabusDetails.getPrerequisites());
        syllabus.setAssessmentMethods(syllabusDetails.getAssessmentMethods());
        syllabus.setTextbooks(syllabusDetails.getTextbooks());
        syllabus.setReferences(syllabusDetails.getReferences());
        syllabus.setCredits(syllabusDetails.getCredits());
        syllabus.setSemester(syllabusDetails.getSemester());
        syllabus.setAcademicYear(syllabusDetails.getAcademicYear());

        Syllabus savedSyllabus = syllabusRepository.save(syllabus);

        // Create new version
        SyllabusVersion latestVersion = syllabusVersionRepository
                .findTopBySyllabusOrderByCreatedAtDesc(syllabus);
        String newVersion = latestVersion != null ? incrementVersion(latestVersion.getVersion()) : "1.1";
        createVersion(savedSyllabus, newVersion, "Updated content", updater);

        return savedSyllabus;
    }

    public void submitForReview(Long syllabusId, User submitter) {
        Syllabus syllabus = syllabusRepository.findById(syllabusId)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));

        if (syllabus.getStatus() != Syllabus.WorkflowStatus.DRAFT) {
            throw new RuntimeException("Can only submit draft syllabi for review");
        }

        workflowService.transitionStatus(syllabus, Syllabus.WorkflowStatus.PENDING_REVIEW, 
                                       submitter, "Submitted for review");
        
        // Notify HoD
        notificationService.notifyHoDForReview(syllabus);
    }

    public List<Syllabus> getSyllabiByCreator(User creator) {
        return syllabusRepository.findByCreatedBy(creator);
    }

    public List<Syllabus> getSyllabiByStatus(Syllabus.WorkflowStatus status) {
        return syllabusRepository.findByStatus(status);
    }

    public List<Syllabus> getSyllabiForReview(String department) {
        return syllabusRepository.findByStatusIn(List.of(
                Syllabus.WorkflowStatus.PENDING_REVIEW,
                Syllabus.WorkflowStatus.PENDING_APPROVAL
        ));
    }

    public Syllabus getSyllabusById(Long id) {
        return syllabusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));
    }

    public List<Syllabus> searchSyllabi(String keyword) {
        return syllabusRepository.searchByKeyword(keyword);
    }

    private void createVersion(Syllabus syllabus, String version, String changeLog, User creator) {
        SyllabusVersion syllabusVersion = new SyllabusVersion();
        syllabusVersion.setSyllabus(syllabus);
        syllabusVersion.setVersion(version);
        syllabusVersion.setContent(buildContentFromSyllabus(syllabus));
        syllabusVersion.setChangeLog(changeLog);
        syllabusVersion.setCreatedBy(creator);
        syllabusVersionRepository.save(syllabusVersion);
    }

    private String buildContentFromSyllabus(Syllabus syllabus) {
        // Build JSON or structured content from syllabus fields
        return String.format("""
            {
                "courseCode": "%s",
                "courseName": "%s",
                "description": "%s",
                "objectives": "%s",
                "prerequisites": "%s",
                "assessmentMethods": "%s",
                "textbooks": "%s",
                "references": "%s"
            }
            """, 
            syllabus.getCourseCode(),
            syllabus.getCourseName(),
            syllabus.getDescription(),
            syllabus.getObjectives(),
            syllabus.getPrerequisites(),
            syllabus.getAssessmentMethods(),
            syllabus.getTextbooks(),
            syllabus.getReferences()
        );
    }

    private String incrementVersion(String currentVersion) {
        String[] parts = currentVersion.split("\\.");
        int major = Integer.parseInt(parts[0]);
        int minor = parts.length > 1 ? Integer.parseInt(parts[1]) : 0;
        return major + "." + (minor + 1);
    }
}