package com.edunexus.lms.controller;

import com.edunexus.lms.dto.request.CourseRequest;
import com.edunexus.lms.dto.response.ApiResponse;
import com.edunexus.lms.model.Course;
import com.edunexus.lms.model.User;
import com.edunexus.lms.security.UserPrincipal;
import com.edunexus.lms.service.AuthService;
import com.edunexus.lms.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final AuthService authService;

    public CourseController(CourseService courseService, AuthService authService) {
        this.courseService = courseService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "newest") String sort) {
        return ResponseEntity.ok(courseService.getAllCourses(category, difficulty, search, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/instructor/my")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Course>> getInstructorCourses(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(courseService.getInstructorCourses(principal.getId()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Course> createCourse(@AuthenticationPrincipal UserPrincipal principal,
                                               @Valid @RequestBody CourseRequest request) {
        User user = authService.getCurrentUser(principal.getUsername());
        return ResponseEntity.ok(courseService.createCourse(request, user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Course> updateCourse(@PathVariable String id,
                                               @AuthenticationPrincipal UserPrincipal principal,
                                               @Valid @RequestBody CourseRequest request) {
        User user = authService.getCurrentUser(principal.getUsername());
        return ResponseEntity.ok(courseService.updateCourse(id, request, user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse> deleteCourse(@PathVariable String id,
                                                    @AuthenticationPrincipal UserPrincipal principal) {
        User user = authService.getCurrentUser(principal.getUsername());
        courseService.deleteCourse(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Course deleted successfully"));
    }
}
