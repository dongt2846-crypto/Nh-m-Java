package com.university.smd.repository;

import com.university.smd.entity.Syllabus;
import com.university.smd.entity.WorkflowState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowRepository extends JpaRepository<WorkflowState, Long> {
    List<WorkflowState> findBySyllabusOrderByCreatedAtDesc(Syllabus syllabus);
    WorkflowState findTopBySyllabusOrderByCreatedAtDesc(Syllabus syllabus);
}