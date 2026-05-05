package com.example.backend.services;

import com.example.backend.models.User;
import com.example.backend.models.Achievement;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    public User registerUser(User user) {
        // Initial setup for new volunteers
        user.setXp(0);
        user.setLevel(1);
        user.setHoursWorked(0);
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User addXp(Long userId, int amount) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setXp(user.getXp() + amount);
        
        // Simple level up logic: every 100 XP is a level
        int newLevel = (user.getXp() / 100) + 1;
        if (newLevel > user.getLevel()) {
            user.setLevel(newLevel);
        }
        
        checkAchievements(user);
        return userRepository.save(user);
    }

    private void checkAchievements(User user) {
        List<Achievement> allAchievements = achievementRepository.findAll();
        StringBuilder currentBadges = new StringBuilder(user.getBadges() != null ? user.getBadges() : "");
        
        for (Achievement achievement : allAchievements) {
            if (user.getXp() >= achievement.getXpThreshold() && !currentBadges.toString().contains(achievement.getName())) {
                if (currentBadges.length() > 0) currentBadges.append(",");
                currentBadges.append(achievement.getName());
            }
        }
        user.setBadges(currentBadges.toString());
    }
}
