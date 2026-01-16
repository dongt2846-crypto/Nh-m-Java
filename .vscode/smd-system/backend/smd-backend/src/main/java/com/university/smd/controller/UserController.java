package com.university.smd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.smd.entity.User;
import com.university.smd.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or @userService.isCurrentUser(#id)")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or @userService.isCurrentUser(#id)")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bulk-import")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> bulkImportUsers(@RequestBody List<User> users) {
        if (users == null || users.isEmpty()) {
            return ResponseEntity.badRequest().body("User list cannot be null or empty");
        }

        int successCount = 0;
        int failureCount = 0;
        StringBuilder errors = new StringBuilder();

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            try {
                // Validate required fields
                if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                    errors.append("User ").append(i + 1).append(": Username is required. ");
                    failureCount++;
                    continue;
                }
                if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                    errors.append("User ").append(i + 1).append(": Email is required. ");
                    failureCount++;
                    continue;
                }

                // Check for duplicates
                if (userService.existsByUsername(user.getUsername())) {
                    errors.append("User ").append(i + 1).append(": Username '").append(user.getUsername()).append("' already exists. ");
                    failureCount++;
                    continue;
                }
                if (userService.existsByEmail(user.getEmail())) {
                    errors.append("User ").append(i + 1).append(": Email '").append(user.getEmail()).append("' already exists. ");
                    failureCount++;
                    continue;
                }

                // Create user
                userService.createUser(user);
                successCount++;

            } catch (Exception e) {
                errors.append("User ").append(i + 1).append(": ").append(e.getMessage()).append(" ");
                failureCount++;
            }
        }

        if (failureCount == 0) {
            return ResponseEntity.ok().body("Successfully imported " + successCount + " users");
        } else {
            String message = String.format("Imported %d users successfully, %d failed. Errors: %s",
                                         successCount, failureCount, errors.toString());
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUserProfile(Authentication auth) {
        try {
            User user = userService.getUserByUsername(auth.getName());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}