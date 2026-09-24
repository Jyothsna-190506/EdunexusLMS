package com.edunexus.lms.dto.response;

import java.util.List;
import java.util.Map;

public class StatsResponse {
    private long totalUsers;
    private long totalStudents;
    private long totalInstructors;
    private long totalCourses;
    private long totalEnrollments;
    private long totalCertificates;
    private double totalRevenue;
    private List<Map<String, Object>> userGrowth;
    private List<Map<String, Object>> categoryDistribution;
    private List<Map<String, Object>> recentEnrollments;

    public StatsResponse() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalInstructors() { return totalInstructors; }
    public void setTotalInstructors(long totalInstructors) { this.totalInstructors = totalInstructors; }

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public long getTotalEnrollments() { return totalEnrollments; }
    public void setTotalEnrollments(long totalEnrollments) { this.totalEnrollments = totalEnrollments; }

    public long getTotalCertificates() { return totalCertificates; }
    public void setTotalCertificates(long totalCertificates) { this.totalCertificates = totalCertificates; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<Map<String, Object>> getUserGrowth() { return userGrowth; }
    public void setUserGrowth(List<Map<String, Object>> userGrowth) { this.userGrowth = userGrowth; }

    public List<Map<String, Object>> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(List<Map<String, Object>> categoryDistribution) { this.categoryDistribution = categoryDistribution; }

    public List<Map<String, Object>> getRecentEnrollments() { return recentEnrollments; }
    public void setRecentEnrollments(List<Map<String, Object>> recentEnrollments) { this.recentEnrollments = recentEnrollments; }
}
