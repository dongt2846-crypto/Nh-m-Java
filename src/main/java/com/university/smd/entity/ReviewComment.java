package com.university.smd.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_comments")
public class ReviewComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collaborative_review_id")
    private CollaborativeReview collaborativeReview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    @Lob
    private String comment;

    private String section; // Which section of syllabus this comment refers to

    @Enumerated(EnumType.STRING)
    private CommentType type = CommentType.GENERAL;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    private boolean resolved = false;

    public enum CommentType {
        GENERAL,
        SUGGESTION,
        ISSUE,
        QUESTION
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    // Constructors
    public ReviewComment() {}

    public ReviewComment(CollaborativeReview collaborativeReview, User reviewer, String comment) {
        this.collaborativeReview = collaborativeReview;
        this.reviewer = reviewer;
        this.comment = comment;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CollaborativeReview getCollaborativeReview() { return collaborativeReview; }
    public void setCollaborativeReview(CollaborativeReview collaborativeReview) { this.collaborativeReview = collaborativeReview; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public CommentType getType() { return type; }
    public void setType(CommentType type) { this.type = type; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}