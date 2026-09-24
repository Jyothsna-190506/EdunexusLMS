package com.edunexus.lms.repository;

import com.edunexus.lms.model.Certificate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends MongoRepository<Certificate, String> {
    Optional<Certificate> findByCertificateId(String certificateId);
    List<Certificate> findByStudentId(String studentId);
    Optional<Certificate> findByStudentIdAndCourseId(String studentId, String courseId);
    boolean existsByStudentIdAndCourseId(String studentId, String courseId);
    long countByStudentId(String studentId);
}
