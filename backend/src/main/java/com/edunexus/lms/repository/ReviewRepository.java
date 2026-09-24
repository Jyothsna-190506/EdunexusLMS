package com.edunexus.lms.repository;

import com.edunexus.lms.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByCourseIdAndModeratedTrue(String courseId);
    List<Review> findByCourseId(String courseId);
    Optional<Review> findByStudentIdAndCourseId(String studentId, String courseId);
    boolean existsByStudentIdAndCourseId(String studentId, String courseId);
}
