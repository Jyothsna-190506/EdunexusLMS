package com.edunexus.lms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public class QuizAttemptRequest {

    @NotBlank(message = "Course ID is required")
    private String courseId;

    @NotNull(message = "Answers map is required")
    private Map<String, Integer> answers; // questionId -> selectedOptionIndex

    public QuizAttemptRequest() {}

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public Map<String, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<String, Integer> answers) { this.answers = answers; }
}
