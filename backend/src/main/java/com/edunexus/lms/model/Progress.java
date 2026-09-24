package com.edunexus.lms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "progress")
@CompoundIndex(name = "student_course_progress_idx", def = "{'studentId': 1, 'courseId': 1}", unique = true)
public class Progress {

    @Id
    private String id;

    private String studentId;
    private String courseId;

    private List<String> completedLessons = new ArrayList<>();
    private String currentLessonId;
    private double percentage = 0.0;

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public Progress() {}

    public Progress(String studentId, String courseId) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.completedLessons = new ArrayList<>();
        this.percentage = 0.0;
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public List<String> getCompletedLessons() { return completedLessons; }
    public void setCompletedLessons(List<String> completedLessons) { this.completedLessons = completedLessons; }

    public String getCurrentLessonId() { return currentLessonId; }
    public void setCurrentLessonId(String currentLessonId) { this.currentLessonId = currentLessonId; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
