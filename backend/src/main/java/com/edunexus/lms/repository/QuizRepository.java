package com.edunexus.lms.repository;

import com.edunexus.lms.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByCourseId(String courseId);
    Optional<Quiz> findFirstByCourseId(String courseId);
}
