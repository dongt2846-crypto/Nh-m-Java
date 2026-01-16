package com.university.smd.repository;

import com.university.smd.entity.SyllabusSubscription;
import com.university.smd.entity.User;
import com.university.smd.entity.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SyllabusSubscriptionRepository extends JpaRepository<SyllabusSubscription, Long> {

    Optional<SyllabusSubscription> findByUserAndSyllabus(User user, Syllabus syllabus);

    List<SyllabusSubscription> findByUser(User user);

    List<SyllabusSubscription> findBySyllabus(Syllabus syllabus);

    boolean existsByUserAndSyllabus(User user, Syllabus syllabus);
}
