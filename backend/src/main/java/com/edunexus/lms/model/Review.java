package com.edunexus.lms.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String studentId;
    private String studentName;
    private String studentImage;

    private String courseId;
    private String courseTitle;

    private double rating; // 1 to 5
    private String comment;
    private boolean moderated = true; // true = approved

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Review() {}

    public Review(String studentId, String studentName, String studentImage, String courseId, String courseTitle, double rating, String comment) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentImage = studentImage;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.rating = rating;
        this.comment = comment;
        this.moderated = true;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentImage() { return studentImage; }
    public void setStudentImage(String studentImage) { this.studentImage = studentImage; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public boolean isModerated() { return moderated; }
    public void setModerated(boolean moderated) { this.moderated = moderated; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
