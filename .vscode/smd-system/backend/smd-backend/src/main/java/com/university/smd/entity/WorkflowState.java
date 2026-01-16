package com.university.smd.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_states")
public class WorkflowState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "syllabus_id")
    private Syllabus syllabus;

    @Enumerated(EnumType.STRING)
    private Syllabus.WorkflowStatus fromStatus;

    @Enumerated(EnumType.STRING)
    private Syllabus.WorkflowStatus toStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private User actor;

    private String comments;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public WorkflowState() {}

    public WorkflowState(Syllabus syllabus, Syllabus.WorkflowStatus fromStatus, 
                        Syllabus.WorkflowStatus toStatus, User actor, String comments) {
        this.syllabus = syllabus;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.actor = actor;
        this.comments = comments;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Syllabus getSyllabus() { return syllabus; }
    public void setSyllabus(Syllabus syllabus) { this.syllabus = syllabus; }

    public Syllabus.WorkflowStatus getFromStatus() { return fromStatus; }
    public void setFromStatus(Syllabus.WorkflowStatus fromStatus) { this.fromStatus = fromStatus; }

    public Syllabus.WorkflowStatus getToStatus() { return toStatus; }
    public void setToStatus(Syllabus.WorkflowStatus toStatus) { this.toStatus = toStatus; }

    public User getActor() { return actor; }
    public void setActor(User actor) { this.actor = actor; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}