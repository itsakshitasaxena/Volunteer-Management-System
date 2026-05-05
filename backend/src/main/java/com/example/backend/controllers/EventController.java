package com.example.backend.controllers;

import com.example.backend.models.Event;
import com.example.backend.models.Task;
import com.example.backend.repositories.EventRepository;
import com.example.backend.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @PostMapping("/events")
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    @GetMapping("/events/{id}/tasks")
    public List<Task> getTasksForEvent(@PathVariable Long id) {
        return taskRepository.findByEventId(id);
    }

    @PostMapping("/events/{id}/tasks")
    public Task createTask(@PathVariable Long id, @RequestBody Task task) {
        Event event = eventRepository.findById(id).orElseThrow();
        task.setEvent(event);
        return taskRepository.save(task);
    }
}
