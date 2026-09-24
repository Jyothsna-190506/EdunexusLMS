package com.edunexus.lms.repository;

import com.edunexus.lms.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends MongoRepository<Progress, String> {
    Optional<Progress> findByStudentIdAndCourseId(String studentId, String courseId);
    List<Progress> findByStudentId(String studentId);
}
