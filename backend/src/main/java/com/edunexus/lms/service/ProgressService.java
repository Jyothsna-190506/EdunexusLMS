package com.edunexus.lms.service;

import com.edunexus.lms.exception.ResourceNotFoundException;
import com.edunexus.lms.model.Course;
import com.edunexus.lms.model.Enrollment;
import com.edunexus.lms.model.Lesson;
import com.edunexus.lms.model.Module;
import com.edunexus.lms.model.Progress;
import com.edunexus.lms.model.User;
import com.edunexus.lms.repository.CourseRepository;
import com.edunexus.lms.repository.EnrollmentRepository;
import com.edunexus.lms.repository.ProgressRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateService certificateService;
    private final NotificationService notificationService;

    public ProgressService(ProgressRepository progressRepository,
                           CourseRepository courseRepository,
                           EnrollmentRepository enrollmentRepository,
                           CertificateService certificateService,
                           NotificationService notificationService) {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.certificateService = certificateService;
        this.notificationService = notificationService;
    }

    public Progress getProgress(String studentId, String courseId) {
        return progressRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseGet(() -> {
                    Progress p = new Progress(studentId, courseId);
                    return progressRepository.save(p);
                });
    }

    public Progress markLessonCompleted(User student, String courseId, String lessonId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        Progress progress = getProgress(student.getId(), courseId);
        List<String> completed = progress.getCompletedLessons();
        if (completed == null) {
            completed = new ArrayList<>();
        }

        if (!completed.contains(lessonId)) {
            completed.add(lessonId);
            progress.setCompletedLessons(completed);
        }

        // Compute total lessons
        int totalLessons = course.getTotalLessons();
        double percentage = totalLessons > 0 ? ((double) completed.size() / totalLessons) * 100.0 : 0.0;
        if (percentage > 100.0) percentage = 100.0;
        percentage = Math.round(percentage * 10.0) / 10.0; // 1 decimal place

        progress.setPercentage(percentage);
        progress.setCurrentLessonId(lessonId);
        progress.setUpdatedAt(Instant.now());
        Progress savedProgress = progressRepository.save(progress);

        // Update Enrollment completion if 100%
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId);
        if (enrollmentOpt.isPresent()) {
            Enrollment enrollment = enrollmentOpt.get();
            enrollment.setProgressPercentage(percentage);
            if (percentage >= 100.0 && !enrollment.isCompleted()) {
                enrollment.setCompleted(true);
                enrollment.setCompletedAt(Instant.now());
                enrollmentRepository.save(enrollment);

                // Auto-generate certificate
                try {
                    certificateService.generateCertificateForCompletion(student, course);
                } catch (Exception e) {
                    System.out.println("Certificate generation note: " + e.getMessage());
                }

                // Notify student
                try {
                    notificationService.createNotification(
                            student.getId(),
                            "Congratulations! Course Completed!",
                            "You have successfully finished all lessons for " + course.getTitle() + ". Your official certificate is ready to view!",
                            "CERTIFICATE",
                            "/profile"
                    );
                } catch (Exception ignored) {}
            } else {
                enrollmentRepository.save(enrollment);
            }
        }

        return savedProgress;
    }

    public Progress updateCurrentLesson(String studentId, String courseId, String lessonId) {
        Progress progress = getProgress(studentId, courseId);
        progress.setCurrentLessonId(lessonId);
        progress.setUpdatedAt(Instant.now());
        return progressRepository.save(progress);
    }
}
