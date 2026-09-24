package com.edunexus.lms.controller;

import com.edunexus.lms.model.Certificate;
import com.edunexus.lms.model.Course;
import com.edunexus.lms.model.User;
import com.edunexus.lms.security.UserPrincipal;
import com.edunexus.lms.service.AuthService;
import com.edunexus.lms.service.CertificateService;
import com.edunexus.lms.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;
    private final AuthService authService;
    private final CourseService courseService;

    public CertificateController(CertificateService certificateService, AuthService authService, CourseService courseService) {
        this.certificateService = certificateService;
        this.authService = authService;
        this.courseService = courseService;
    }

    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<Certificate> verifyCertificate(@PathVariable String certificateId) {
        return ResponseEntity.ok(certificateService.verifyCertificate(certificateId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Certificate>> getMyCertificates(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(certificateService.getStudentCertificates(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificateById(@PathVariable String id) {
        return ResponseEntity.ok(certificateService.getCertificateById(id));
    }

    @PostMapping("/generate")
    public ResponseEntity<Certificate> generateCertificate(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestBody Map<String, String> body) {
        User user = authService.getCurrentUser(principal.getUsername());
        Course course = courseService.getCourseById(body.get("courseId"));
        return ResponseEntity.ok(certificateService.generateCertificateForCompletion(user, course));
    }
}
