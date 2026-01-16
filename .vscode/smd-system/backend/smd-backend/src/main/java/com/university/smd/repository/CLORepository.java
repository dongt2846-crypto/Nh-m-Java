package com.university.smd.repository;

import com.university.smd.entity.CLO;
import com.university.smd.entity.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CLORepository extends JpaRepository<CLO, Long> {
    List<CLO> findBySyllabus(Syllabus syllabus);
    List<CLO> findBySyllabusOrderByCodeAsc(Syllabus syllabus);
}