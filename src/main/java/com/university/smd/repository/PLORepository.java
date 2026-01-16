package com.university.smd.repository;

import com.university.smd.entity.PLO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PLORepository extends JpaRepository<PLO, Long> {
    List<PLO> findByProgram(String program);
    List<PLO> findByProgramOrderByCodeAsc(String program);
    List<PLO> findByCategory(String category);
}