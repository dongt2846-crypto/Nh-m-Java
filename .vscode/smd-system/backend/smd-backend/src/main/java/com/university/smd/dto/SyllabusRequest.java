package com.university.smd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SyllabusRequest {
    @NotBlank
    private String courseCode;

    @NotBlank
    private String courseName;

    private String department;

    @NotNull
    private Integer credits;

    private String semester;
    private String academicYear;
    private String description;
    private String objectives;
    private String prerequisites;
    private String assessmentMethods;
    private String textbooks;
    private String references;

    // Constructors
    public SyllabusRequest() {}

    // Getters and Setters
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
}