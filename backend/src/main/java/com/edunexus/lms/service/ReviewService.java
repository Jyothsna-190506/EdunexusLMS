package com.edunexus.lms.service;

import com.edunexus.lms.dto.request.ReviewRequest;
import com.edunexus.lms.exception.BadRequestException;
import com.edunexus.lms.exception.ResourceNotFoundException;
import com.edunexus.lms.model.Course;
import com.edunexus.lms.model.Review;
import com.edunexus.lms.model.User;
import com.edunexus.lms.repository.CourseRepository;
import com.edunexus.lms.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;

    public ReviewService(ReviewRepository reviewRepository, CourseRepository courseRepository) {
        this.reviewRepository = reviewRepository;
        this.courseRepository = courseRepository;
    }

    public List<Review> getReviewsByCourse(String courseId) {
        return reviewRepository.findByCourseIdAndModeratedTrue(courseId);
    }

    public Review addReview(User student, ReviewRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + request.getCourseId()));

        Optional<Review> existingOpt = reviewRepository.findByStudentIdAndCourseId(student.getId(), request.getCourseId());
        Review review;
        if (existingOpt.isPresent()) {
            review = existingOpt.get();
            review.setRating(request.getRating());
            review.setComment(request.getComment());
            review.setCreatedAt(Instant.now());
        } else {
            review = new Review(
                    student.getId(),
                    student.getName(),
                    student.getProfileImage() != null ? student.getProfileImage() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                    course.getId(),
                    course.getTitle(),
                    request.getRating(),
                    request.getComment()
            );
        }

        Review saved = reviewRepository.save(review);

        // Recalculate Course rating
        List<Review> allReviews = reviewRepository.findByCourseId(course.getId());
        if (!allReviews.isEmpty()) {
            double avg = allReviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
            course.setRating(Math.round(avg * 10.0) / 10.0);
            course.setReviewCount(allReviews.size());
            courseRepository.save(course);
        }

        return saved;
    }

    public List<Review> getAllReviewsForInstructor(String instructorId) {
        List<Course> courses = courseRepository.findByInstructorId(instructorId);
        return courses.stream()
                .flatMap(c -> reviewRepository.findByCourseId(c.getId()).stream())
                .toList();
    }
}
