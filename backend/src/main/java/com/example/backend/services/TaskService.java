package com.example.backend.services;

import com.example.backend.models.Task;
import com.example.backend.models.User;
import com.example.backend.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getRecommendedTasks(User volunteer) {
        List<Task> allTasks = taskRepository.findAll();
        
        if (volunteer.getSkills() == null || volunteer.getSkills().isEmpty()) {
            return allTasks;
        }

        String[] userSkills = volunteer.getSkills().toLowerCase().split(",");
        
        return allTasks.stream().filter(task -> {
            if (task.getRequiredSkills() == null || task.getRequiredSkills().isEmpty()) return true;
            
            String reqSkills = task.getRequiredSkills().toLowerCase();
            for (String s : userSkills) {
                if (reqSkills.contains(s.trim())) {
                    return true;
                }
            }
            return false;
        }).collect(Collectors.toList());
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }
}
