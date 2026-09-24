package com.edunexus.lms.service;

import com.edunexus.lms.exception.BadRequestException;
import com.edunexus.lms.exception.ResourceNotFoundException;
import com.edunexus.lms.model.Course;
import com.edunexus.lms.model.Enrollment;
import com.edunexus.lms.model.Progress;
import com.edunexus.lms.model.User;
import com.edunexus.lms.repository.CourseRepository;
import com.edunexus.lms.repository.EnrollmentRepository;
import com.edunexus.lms.repository.ProgressRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final ProgressRepository progressRepository;
    private final NotificationService notificationService;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             CourseRepository courseRepository,
                             ProgressRepository progressRepository,
                             NotificationService notificationService) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.progressRepository = progressRepository;
        this.notificationService = notificationService;
    }

    public Enrollment enrollStudent(String studentId, String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).get();
        }

        Enrollment enrollment = new Enrollment(studentId, courseId);
        Enrollment saved = enrollmentRepository.save(enrollment);

        // Update Course enrolled count
        course.setEnrolledStudents(course.getEnrolledStudents() + 1);
        courseRepository.save(course);

        // Initialize Progress
        Progress progress = new Progress(studentId, courseId);
        if (course.getModules() != null && !course.getModules().isEmpty() &&
            course.getModules().get(0).getLessons() != null && !course.getModules().get(0).getLessons().isEmpty()) {
            progress.setCurrentLessonId(course.getModules().get(0).getLessons().get(0).getId());
        }
        progressRepository.save(progress);

        // Send notification
        try {
            notificationService.createNotification(
                    studentId,
                    "Enrolled in " + course.getTitle(),
                    "You have successfully enrolled in " + course.getTitle() + ". Start watching lessons now!",
                    "ENROLLMENT",
                    "/learn/" + courseId + "/" + (progress.getCurrentLessonId() != null ? progress.getCurrentLessonId() : "")
            );
        } catch (Exception ignored) {}

        return saved;
    }

    public List<Map<String, Object>> getStudentEnrollmentsWithCourses(String studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Optional<Course> courseOpt = courseRepository.findById(enrollment.getCourseId());
            if (courseOpt.isPresent()) {
                Course course = courseOpt.get();
                Optional<Progress> progressOpt = progressRepository.findByStudentIdAndCourseId(studentId, course.getId());

                Map<String, Object> map = new HashMap<>();
                map.put("enrollment", enrollment);
                map.put("course", course);
                map.put("progress", progressOpt.orElse(new Progress(studentId, course.getId())));
                result.add(map);
            }
        }

        return result;
    }

    public boolean isStudentEnrolled(String studentId, String courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }
}
