package com.edunexus.lms.repository;

import com.edunexus.lms.model.Course;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    Optional<Course> findBySlug(String slug);
    List<Course> findByPublishedTrue();
    List<Course> findByPublishedTrue(Sort sort);
    List<Course> findByInstructorId(String instructorId);
    List<Course> findByCategoryIgnoreCaseAndPublishedTrue(String category);
    List<Course> findByDifficultyIgnoreCaseAndPublishedTrue(String difficulty);

    @Query("{ 'published': true, $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } }, { 'category': { $regex: ?0, $options: 'i' } }, { 'instructorName': { $regex: ?0, $options: 'i' } } ] }")
    List<Course> searchCourses(String query);

    long countByPublishedTrue();
}
