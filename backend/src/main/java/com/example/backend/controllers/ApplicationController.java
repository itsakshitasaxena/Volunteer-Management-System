package com.example.backend.controllers;

import com.example.backend.models.ApplicationStatus;
import com.example.backend.models.TaskApplication;
import com.example.backend.repositories.TaskApplicationRepository;
import com.example.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private TaskApplicationRepository applicationRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public List<TaskApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    @GetMapping("/volunteer/{volunteerId}")
    public List<TaskApplication> getVolunteerApplications(@PathVariable Long volunteerId) {
        return applicationRepository.findByVolunteerId(volunteerId);
    }

    @GetMapping("/task/{taskId}")
    public List<TaskApplication> getTaskApplications(@PathVariable Long taskId) {
        return applicationRepository.findByTaskId(taskId);
    }

    @PutMapping("/{appId}/status")
    public TaskApplication updateStatus(@PathVariable Long appId, @RequestParam ApplicationStatus status) {
        TaskApplication app = applicationRepository.findById(appId).orElseThrow();
        app.setStatus(status);
        
        if (status == ApplicationStatus.COMPLETED) {
            int xpReward = app.getTask().getHours() * 10;
            userService.addXp(app.getVolunteer().getId(), xpReward);
            
            app.getVolunteer().setHoursWorked(app.getVolunteer().getHoursWorked() + app.getTask().getHours());
        }
        
        return applicationRepository.save(app);
    }

    @PostMapping("/{appId}/checkin")
    public TaskApplication checkIn(@PathVariable Long appId) {
        TaskApplication app = applicationRepository.findById(appId).orElseThrow();
        // In a real app, this might just mark attendance. Here we auto-complete for simplicity.
        return updateStatus(appId, ApplicationStatus.COMPLETED);
    }
}
