package com.edunexus.lms.dto.request;

import jakarta.validation.constraints.NotBlank;

public class LessonProgressRequest {
    @NotBlank(message = "Course ID is required")
    private String courseId;

    @NotBlank(message = "Lesson ID is required")
    private String lessonId;

    public LessonProgressRequest() {}

    public LessonProgressRequest(String courseId, String lessonId) {
        this.courseId = courseId;
        this.lessonId = lessonId;
    }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getLessonId() { return lessonId; }
    public void setLessonId(String lessonId) { this.lessonId = lessonId; }
}
