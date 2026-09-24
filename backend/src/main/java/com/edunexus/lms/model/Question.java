package com.edunexus.lms.model;

import java.util.ArrayList;
import java.util.List;

public class Question {

    private String id;
    private String questionText;
    private List<String> options = new ArrayList<>();
    private int correctOptionIndex;
    private String explanation;
    private int points = 1;

    public Question() {}

    public Question(String id, String questionText, List<String> options, int correctOptionIndex, String explanation) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctOptionIndex = correctOptionIndex;
        this.explanation = explanation;
        this.points = 1;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public int getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(int correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
}
