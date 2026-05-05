package com.example.backend.repositories;

import com.example.backend.models.TaskApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskApplicationRepository extends JpaRepository<TaskApplication, Long> {
    List<TaskApplication> findByVolunteerId(Long volunteerId);
    List<TaskApplication> findByTaskId(Long taskId);
}
