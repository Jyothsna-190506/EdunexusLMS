package com.edunexus.lms.controller;

import com.edunexus.lms.dto.response.ApiResponse;
import com.edunexus.lms.model.Enrollment;
import com.edunexus.lms.security.UserPrincipal;
import com.edunexus.lms.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<Enrollment> enroll(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestBody Map<String, String> body) {
        String courseId = body.get("courseId");
        return ResponseEntity.ok(enrollmentService.enrollStudent(principal.getId(), courseId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyEnrollments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(enrollmentService.getStudentEnrollmentsWithCourses(principal.getId()));
    }

    @GetMapping("/check/{courseId}")
    public ResponseEntity<ApiResponse> checkEnrollment(@AuthenticationPrincipal UserPrincipal principal,
                                                       @PathVariable String courseId) {
        if (principal == null) {
            return ResponseEntity.ok(ApiResponse.ok("Status", false));
        }
        boolean enrolled = enrollmentService.isStudentEnrolled(principal.getId(), courseId);
        return ResponseEntity.ok(ApiResponse.ok("Status", enrolled));
    }
}
