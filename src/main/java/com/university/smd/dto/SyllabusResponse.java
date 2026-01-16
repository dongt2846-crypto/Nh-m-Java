package com.university.smd.dto;

import com.university.smd.entity.Syllabus;
import java.time.LocalDateTime;

public class SyllabusResponse {
    private Long id;
    private String courseCode;
    private String courseName;
    private String department;
    private Integer credits;
    private String semester;
    private String academicYear;
    private String description;
    private String objectives;
    private String prerequisites;
    private String assessmentMethods;
    private String textbooks;
    private String references;
    private String status;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public SyllabusResponse() {}

    public SyllabusResponse(Syllabus syllabus) {
        this.id = syllabus.getId();
        this.courseCode = syllabus.getCourseCode();
        this.courseName = syllabus.getCourseName();
        this.department = syllabus.getDepartment();
        this.credits = syllabus.getCredits();
        this.semester = syllabus.getSemester();
        this.academicYear = syllabus.getAcademicYear();
        this.description = syllabus.getDescription();
        this.objectives = syllabus.getObjectives();
        this.prerequisites = syllabus.getPrerequisites();
        this.assessmentMethods = syllabus.getAssessmentMethods();
        this.textbooks = syllabus.getTextbooks();
        this.references = syllabus.getReferences();
        this.status = syllabus.getStatus().name();
        this.createdBy = syllabus.getCreatedBy().getFullName();
        this.createdAt = syllabus.getCreatedAt();
        this.updatedAt = syllabus.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getObjectives() { return objectives; }
    public void setObjectives(String objectives) { this.objectives = objectives; }

    public String getPrerequisites() { return prerequisites; }
    public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }

    public String getAssessmentMethods() { return assessmentMethods; }
    public void setAssessmentMethods(String assessmentMethods) { this.assessmentMethods = assessmentMethods; }

    public String getTextbooks() { return textbooks; }
    public void setTextbooks(String textbooks) { this.textbooks = textbooks; }

    public String getReferences() { return references; }
    public void setReferences(String references) { this.references = references; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}