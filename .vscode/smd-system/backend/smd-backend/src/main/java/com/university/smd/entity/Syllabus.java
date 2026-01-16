package com.university.smd.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "syllabi")
public class Syllabus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String courseCode;

    @NotBlank
    private String courseName;

    private String department;
    private Integer credits;
    private String semester;
    private String academicYear;

    @Lob
    private String description;

    @Lob
    private String objectives;

    @Lob
    private String prerequisites;

    @Lob
    private String assessmentMethods;

    @Lob
    private String textbooks;

    @Lob
    @Column(name = "reference_list")
    private String references;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Enumerated(EnumType.STRING)
    private WorkflowStatus status = WorkflowStatus.DRAFT;

    @OneToMany(mappedBy = "syllabus", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SyllabusVersion> versions;

    @OneToMany(mappedBy = "syllabus", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CLO> clos;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum WorkflowStatus {
        DRAFT,
        PENDING_REVIEW,
        PENDING_APPROVAL,
        APPROVED,
        PUBLISHED,
        REJECTED
    }

    // Constructors
    public Syllabus() {}

    public Syllabus(String courseCode, String courseName, User createdBy) {
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.createdBy = createdBy;
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

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public WorkflowStatus getStatus() { return status; }
    public void setStatus(WorkflowStatus status) { this.status = status; }

    public List<SyllabusVersion> getVersions() { return versions; }
    public void setVersions(List<SyllabusVersion> versions) { this.versions = versions; }

    public List<CLO> getClos() { return clos; }
    public void setClos(List<CLO> clos) { this.clos = clos; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}