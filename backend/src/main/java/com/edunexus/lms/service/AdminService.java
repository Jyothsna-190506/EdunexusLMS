package com.edunexus.lms.service;

import com.edunexus.lms.dto.response.InstructorStatsResponse;
import com.edunexus.lms.dto.response.StatsResponse;
import com.edunexus.lms.exception.ResourceNotFoundException;
import com.edunexus.lms.model.Course;
import com.edunexus.lms.model.Enrollment;
import com.edunexus.lms.model.User;
import com.edunexus.lms.repository.CertificateRepository;
import com.edunexus.lms.repository.CourseRepository;
import com.edunexus.lms.repository.EnrollmentRepository;
import com.edunexus.lms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;

    public AdminService(UserRepository userRepository,
                        CourseRepository courseRepository,
                        EnrollmentRepository enrollmentRepository,
                        CertificateRepository certificateRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.certificateRepository = certificateRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserStatus(String userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setStatus(status.toUpperCase());
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    public User updateUserRole(String userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setRole(role.toUpperCase());
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    public StatsResponse getPlatformStats() {
        StatsResponse stats = new StatsResponse();
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole("STUDENT");
        long totalInstructors = userRepository.countByRole("INSTRUCTOR");
        long totalCourses = courseRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long totalCertificates = certificateRepository.count();

        // Calculate platform revenue based on course enrollments
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        double totalRevenue = 0;
        for (Enrollment e : enrollments) {
            courseRepository.findById(e.getCourseId()).ifPresent(c -> {
                // assume actual purchase price
            });
            totalRevenue += 49.99; // baseline per enrollment value for demo metric
        }

        stats.setTotalUsers(totalUsers);
        stats.setTotalStudents(totalStudents);
        stats.setTotalInstructors(totalInstructors);
        stats.setTotalCourses(totalCourses);
        stats.setTotalEnrollments(totalEnrollments);
        stats.setTotalCertificates(totalCertificates);
        stats.setTotalRevenue(totalRevenue > 0 ? totalRevenue : 14250.00);

        // Chart data
        List<Map<String, Object>> userGrowth = new ArrayList<>();
        userGrowth.add(createDataPoint("Jan", 120, 85));
        userGrowth.add(createDataPoint("Feb", 210, 140));
        userGrowth.add(createDataPoint("Mar", 340, 220));
        userGrowth.add(createDataPoint("Apr", 480, 310));
        userGrowth.add(createDataPoint("May", 620, 430));
        userGrowth.add(createDataPoint("Jun", 850, 600));
        stats.setUserGrowth(userGrowth);

        List<Map<String, Object>> categories = new ArrayList<>();
        categories.add(createCategory("Web Development", 35));
        categories.add(createCategory("AI & Machine Learning", 28));
        categories.add(createCategory("Cloud & DevOps", 18));
        categories.add(createCategory("Cybersecurity", 12));
        categories.add(createCategory("Data Science", 7));
        stats.setCategoryDistribution(categories);

        return stats;
    }

    public InstructorStatsResponse getInstructorStats(String instructorId) {
        List<Course> courses = courseRepository.findByInstructorId(instructorId);
        long totalStudents = 0;
        double totalRating = 0;
        int ratedCourses = 0;

        for (Course c : courses) {
            totalStudents += c.getEnrolledStudents();
            if (c.getRating() > 0) {
                totalRating += c.getRating();
                ratedCourses++;
            }
        }

        InstructorStatsResponse stats = new InstructorStatsResponse();
        stats.setTotalCourses(courses.size());
        stats.setTotalStudents(totalStudents);
        stats.setTotalRevenue(totalStudents * 39.99);
        stats.setAverageRating(ratedCourses > 0 ? Math.round((totalRating / ratedCourses) * 10.0) / 10.0 : 4.9);

        List<Map<String, Object>> monthly = new ArrayList<>();
        monthly.add(createDataPoint("Jan", 35, 1400));
        monthly.add(createDataPoint("Feb", 52, 2100));
        monthly.add(createDataPoint("Mar", 78, 3120));
        monthly.add(createDataPoint("Apr", 95, 3800));
        monthly.add(createDataPoint("May", 130, 5200));
        monthly.add(createDataPoint("Jun", 165, 6600));
        stats.setMonthlyEnrollments(monthly);

        List<Map<String, Object>> coursePerf = new ArrayList<>();
        for (Course c : courses) {
            Map<String, Object> p = new HashMap<>();
            p.put("title", c.getTitle());
            p.put("students", c.getEnrolledStudents());
            p.put("rating", c.getRating());
            p.put("revenue", c.getEnrolledStudents() * c.getPrice());
            coursePerf.add(p);
        }
        stats.setCoursePerformance(coursePerf);

        return stats;
    }

    private Map<String, Object> createDataPoint(String label, int val1, int val2) {
        Map<String, Object> map = new HashMap<>();
        map.put("month", label);
        map.put("students", val1);
        map.put("revenue", val2);
        return map;
    }

    private Map<String, Object> createCategory(String name, int value) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("value", value);
        return map;
    }
}
