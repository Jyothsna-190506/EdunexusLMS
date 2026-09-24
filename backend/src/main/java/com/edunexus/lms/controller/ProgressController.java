package com.edunexus.lms.controller;

import com.edunexus.lms.dto.request.LessonProgressRequest;
import com.edunexus.lms.model.Progress;
import com.edunexus.lms.model.User;
import com.edunexus.lms.security.UserPrincipal;
import com.edunexus.lms.service.AuthService;
import com.edunexus.lms.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;
    private final AuthService authService;

    public ProgressController(ProgressService progressService, AuthService authService) {
        this.progressService = progressService;
        this.authService = authService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<Progress> getProgress(@AuthenticationPrincipal UserPrincipal principal,
                                                @PathVariable String courseId) {
        return ResponseEntity.ok(progressService.getProgress(principal.getId(), courseId));
    }

    @PostMapping
    public ResponseEntity<Progress> updateProgress(@AuthenticationPrincipal UserPrincipal principal,
                                                   @Valid @RequestBody LessonProgressRequest request) {
        User user = authService.getCurrentUser(principal.getUsername());
        return ResponseEntity.ok(progressService.markLessonCompleted(user, request.getCourseId(), request.getLessonId()));
    }

    @PostMapping("/complete-lesson")
    public ResponseEntity<Progress> markLessonCompleted(@AuthenticationPrincipal UserPrincipal principal,
                                                        @Valid @RequestBody LessonProgressRequest request) {
        User user = authService.getCurrentUser(principal.getUsername());
        return ResponseEntity.ok(progressService.markLessonCompleted(user, request.getCourseId(), request.getLessonId()));
    }

    @PostMapping("/current-lesson")
    public ResponseEntity<Progress> updateCurrentLesson(@AuthenticationPrincipal UserPrincipal principal,
                                                        @Valid @RequestBody LessonProgressRequest request) {
        return ResponseEntity.ok(progressService.updateCurrentLesson(principal.getId(), request.getCourseId(), request.getLessonId()));
    }
}
