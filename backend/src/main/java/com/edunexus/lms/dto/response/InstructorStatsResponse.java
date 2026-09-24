package com.edunexus.lms.dto.response;

import java.util.List;
import java.util.Map;

public class InstructorStatsResponse {
    private long totalCourses;
    private long totalStudents;
    private double totalRevenue;
    private double averageRating;
    private List<Map<String, Object>> monthlyEnrollments;
    private List<Map<String, Object>> coursePerformance;

    public InstructorStatsResponse() {}

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public List<Map<String, Object>> getMonthlyEnrollments() { return monthlyEnrollments; }
    public void setMonthlyEnrollments(List<Map<String, Object>> monthlyEnrollments) { this.monthlyEnrollments = monthlyEnrollments; }

    public List<Map<String, Object>> getCoursePerformance() { return coursePerformance; }
    public void setCoursePerformance(List<Map<String, Object>> coursePerformance) { this.coursePerformance = coursePerformance; }
}
