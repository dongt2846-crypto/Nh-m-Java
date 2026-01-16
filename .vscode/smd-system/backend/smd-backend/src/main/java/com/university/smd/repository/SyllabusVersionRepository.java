package com.university.smd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.smd.entity.Syllabus;
import com.university.smd.entity.SyllabusVersion;

@Repository
public interface SyllabusVersionRepository extends JpaRepository<SyllabusVersion, Long> {
    List<SyllabusVersion> findBySyllabusOrderByCreatedAtDesc(Syllabus syllabus);
    SyllabusVersion findTopBySyllabusOrderByCreatedAtDesc(Syllabus syllabus);
}