package com.university.smd.repository;

import com.university.smd.entity.CollaborativeReview;
import com.university.smd.entity.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollaborativeReviewRepository extends JpaRepository<CollaborativeReview, Long> {
    List<CollaborativeReview> findBySyllabusOrderByStartDateDesc(Syllabus syllabus);
    Optional<CollaborativeReview> findBySyllabusAndStatus(Syllabus syllabus, CollaborativeReview.ReviewStatus status);
    List<CollaborativeReview> findByStatus(CollaborativeReview.ReviewStatus status);
}