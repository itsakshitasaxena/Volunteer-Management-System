package com.example.backend.controllers;

import com.example.backend.models.ApplicationStatus;
import com.example.backend.models.Task;
import com.example.backend.models.TaskApplication;
import com.example.backend.models.User;
import com.example.backend.repositories.TaskApplicationRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskApplicationRepository taskApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/recommended/{volunteerId}")
    public List<Task> getRecommendedTasks(@PathVariable Long volunteerId) {
        User volunteer = userRepository.findById(volunteerId).orElseThrow();
        return taskService.getRecommendedTasks(volunteer);
    }

    @PostMapping("/{taskId}/apply")
    public TaskApplication applyForTask(@PathVariable Long taskId, @RequestParam Long volunteerId) {
        Task task = taskService.getAllTasks().stream()
                .filter(t -> t.getId().equals(taskId))
                .findFirst().orElseThrow();
        User volunteer = userRepository.findById(volunteerId).orElseThrow();

        TaskApplication app = new TaskApplication();
        app.setTask(task);
        app.setVolunteer(volunteer);
        app.setStatus(ApplicationStatus.PENDING);
        return taskApplicationRepository.save(app);
    }
}
