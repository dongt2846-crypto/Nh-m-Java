package com.university.smd.repository;

import com.university.smd.entity.Syllabus;
import com.university.smd.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusRepository extends JpaRepository<Syllabus, Long> {
    List<Syllabus> findByCreatedBy(User createdBy);
    List<Syllabus> findByStatus(Syllabus.WorkflowStatus status);
    List<Syllabus> findByDepartment(String department);
    List<Syllabus> findByCourseCode(String courseCode);
    List<Syllabus> findByAcademicYear(String academicYear);
    
    @Query("SELECT s FROM Syllabus s WHERE s.status IN :statuses")
    List<Syllabus> findByStatusIn(List<Syllabus.WorkflowStatus> statuses);
    
    @Query("SELECT s FROM Syllabus s WHERE s.courseCode LIKE %:keyword% OR s.courseName LIKE %:keyword%")
    List<Syllabus> searchByKeyword(String keyword);
}