package com.edunexus.lms.dto.response;

import com.edunexus.lms.model.QuizAttempt;

import java.util.List;
import java.util.Map;

public class QuizResultResponse {

    private QuizAttempt attempt;
    private int score;
    private int totalQuestions;
    private double percentage;
    private boolean passed;
    private int passingScorePercentage;
    private String feedback;
    private List<QuestionReview> questionReviews;

    public static class QuestionReview {
        private String questionId;
        private String questionText;
        private List<String> options;
        private Integer selectedOptionIndex;
        private int correctOptionIndex;
        private boolean isCorrect;
        private String explanation;

        public QuestionReview() {}

        public QuestionReview(String questionId, String questionText, List<String> options,
                              Integer selectedOptionIndex, int correctOptionIndex,
                              boolean isCorrect, String explanation) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.options = options;
            this.selectedOptionIndex = selectedOptionIndex;
            this.correctOptionIndex = correctOptionIndex;
            this.isCorrect = isCorrect;
            this.explanation = explanation;
        }

        public String getQuestionId() { return questionId; }
        public void setQuestionId(String questionId) { this.questionId = questionId; }

        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }

        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }

        public Integer getSelectedOptionIndex() { return selectedOptionIndex; }
        public void setSelectedOptionIndex(Integer selectedOptionIndex) { this.selectedOptionIndex = selectedOptionIndex; }

        public int getCorrectOptionIndex() { return correctOptionIndex; }
        public void setCorrectOptionIndex(int correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }

        public boolean isCorrect() { return isCorrect; }
        public void setCorrect(boolean correct) { isCorrect = correct; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }

    public QuizResultResponse() {}

    public QuizAttempt getAttempt() { return attempt; }
    public void setAttempt(QuizAttempt attempt) { this.attempt = attempt; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public int getPassingScorePercentage() { return passingScorePercentage; }
    public void setPassingScorePercentage(int passingScorePercentage) { this.passingScorePercentage = passingScorePercentage; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public List<QuestionReview> getQuestionReviews() { return questionReviews; }
    public void setQuestionReviews(List<QuestionReview> questionReviews) { this.questionReviews = questionReviews; }
}
