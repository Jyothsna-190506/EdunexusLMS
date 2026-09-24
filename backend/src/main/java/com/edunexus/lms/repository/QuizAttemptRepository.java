package com.edunexus.lms.repository;

import com.edunexus.lms.model.QuizAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends MongoRepository<QuizAttempt, String> {
    List<QuizAttempt> findByStudentId(String studentId);
    List<QuizAttempt> findByQuizId(String quizId);
    List<QuizAttempt> findByStudentIdAndQuizId(String studentId, String quizId);
    Optional<QuizAttempt> findTopByStudentIdAndQuizIdOrderByAttemptedAtDesc(String studentId, String quizId);
    long countByStudentIdAndPassedTrue(String studentId);
}
