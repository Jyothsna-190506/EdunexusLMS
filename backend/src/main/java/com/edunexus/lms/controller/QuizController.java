package com.edunexus.lms.controller;

import com.edunexus.lms.dto.request.QuizAttemptRequest;
import com.edunexus.lms.dto.response.QuizResultResponse;
import com.edunexus.lms.model.Quiz;
import com.edunexus.lms.model.QuizAttempt;
import com.edunexus.lms.model.User;
import com.edunexus.lms.security.UserPrincipal;
import com.edunexus.lms.service.AuthService;
import com.edunexus.lms.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final AuthService authService;

    public QuizController(QuizService quizService, AuthService authService) {
        this.quizService = quizService;
        this.authService = authService;
    }

    @GetMapping("/{idOrCourseId}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable String idOrCourseId) {
        Optional<Quiz> quiz = quizService.getQuizByIdOrCourseId(idOrCourseId);
        return quiz.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<Quiz> getQuizByCourseId(@PathVariable String courseId) {
        Optional<Quiz> quiz = quizService.getQuizByCourseId(courseId);
        return quiz.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Quiz> saveQuiz(@RequestBody Quiz quiz) {
        return ResponseEntity.ok(quizService.saveQuiz(quiz));
    }

    @PostMapping("/{quizId}/attempt")
    public ResponseEntity<QuizResultResponse> submitAttempt(@PathVariable String quizId,
                                                            @AuthenticationPrincipal UserPrincipal principal,
                                                            @Valid @RequestBody QuizAttemptRequest request) {
        User user = authService.getCurrentUser(principal.getUsername());
        return ResponseEntity.ok(quizService.submitQuizAttempt(user, quizId, request));
    }

    @GetMapping("/attempts/my")
    public ResponseEntity<List<QuizAttempt>> getMyAttempts(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(quizService.getStudentAttempts(principal.getId()));
    }
}
