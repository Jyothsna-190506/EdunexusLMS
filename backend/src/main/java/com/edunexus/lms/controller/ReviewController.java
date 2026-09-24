package com.edunexus.lms.controller;

import com.edunexus.lms.dto.request.ReviewRequest;
import com.edunexus.lms.model.Review;
import com.edunexus.lms.model.User;
import com.edunexus.lms.security.UserPrincipal;
import com.edunexus.lms.service.AuthService;
import com.edunexus.lms.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthService authService;

    public ReviewController(ReviewService reviewService, AuthService authService) {
        this.reviewService = reviewService;
        this.authService = authService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Review>> getCourseReviews(@PathVariable String courseId) {
        return ResponseEntity.ok(reviewService.getReviewsByCourse(courseId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@AuthenticationPrincipal UserPrincipal principal,
                                            @Valid @RequestBody ReviewRequest request) {
        User user = authService.getCurrentUser(principal.getUsername());
        return ResponseEntity.ok(reviewService.addReview(user, request));
    }

    @GetMapping("/instructor/my")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Review>> getInstructorReviews(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(reviewService.getAllReviewsForInstructor(principal.getId()));
    }
}
