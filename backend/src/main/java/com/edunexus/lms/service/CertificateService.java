package com.edunexus.lms.service;

import com.edunexus.lms.exception.ResourceNotFoundException;
import com.edunexus.lms.model.Certificate;
import com.edunexus.lms.model.Course;
import com.edunexus.lms.model.User;
import com.edunexus.lms.repository.CertificateRepository;
import com.edunexus.lms.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;

    public CertificateService(CertificateRepository certificateRepository,
                              CourseRepository courseRepository) {
        this.certificateRepository = certificateRepository;
        this.courseRepository = courseRepository;
    }

    public Certificate generateCertificateForCompletion(User student, Course course) {
        Optional<Certificate> existing = certificateRepository.findByStudentIdAndCourseId(student.getId(), course.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        String certCode = "NEX-" + (Instant.now().getEpochSecond() % 100000000);
        String verificationUrl = "/verify-certificate/" + certCode;

        Certificate cert = new Certificate(
                certCode,
                student.getId(),
                student.getName(),
                student.getEmail(),
                course.getId(),
                course.getTitle(),
                course.getInstructorName(),
                98.5
        );
        cert.setVerificationUrl(verificationUrl);

        return certificateRepository.save(cert);
    }

    public Certificate verifyCertificate(String certificateId) {
        return certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("No valid verified certificate found with ID: " + certificateId));
    }

    public List<Certificate> getStudentCertificates(String studentId) {
        return certificateRepository.findByStudentId(studentId);
    }

    public Certificate getCertificateById(String id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found: " + id));
    }
}
