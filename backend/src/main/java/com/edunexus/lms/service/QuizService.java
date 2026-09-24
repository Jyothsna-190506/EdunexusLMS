package com.edunexus.lms.service;

import com.edunexus.lms.dto.request.QuizAttemptRequest;
import com.edunexus.lms.dto.response.QuizResultResponse;
import com.edunexus.lms.exception.ResourceNotFoundException;
import com.edunexus.lms.model.Course;
import com.edunexus.lms.model.Question;
import com.edunexus.lms.model.Quiz;
import com.edunexus.lms.model.QuizAttempt;
import com.edunexus.lms.model.User;
import com.edunexus.lms.repository.CourseRepository;
import com.edunexus.lms.repository.QuizAttemptRepository;
import com.edunexus.lms.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CourseRepository courseRepository;
    private final NotificationService notificationService;

    public QuizService(QuizRepository quizRepository,
                       QuizAttemptRepository quizAttemptRepository,
                       CourseRepository courseRepository,
                       NotificationService notificationService) {
        this.quizRepository = quizRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.courseRepository = courseRepository;
        this.notificationService = notificationService;
    }

    public Optional<Quiz> getQuizByCourseId(String courseId) {
        return quizRepository.findFirstByCourseId(courseId);
    }

    public Optional<Quiz> getQuizByIdOrCourseId(String idOrCourseId) {
        Optional<Quiz> byId = quizRepository.findById(idOrCourseId);
        if (byId.isPresent()) return byId;
        return quizRepository.findFirstByCourseId(idOrCourseId);
    }

    public Quiz saveQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public QuizResultResponse submitQuizAttempt(User student, String quizId, QuizAttemptRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizId));

        Map<String, Integer> answers = request.getAnswers();
        List<Question> questions = quiz.getQuestions();
        if (questions == null) questions = new ArrayList<>();

        int score = 0;
        int totalQuestions = questions.size();
        List<QuizResultResponse.QuestionReview> reviews = new ArrayList<>();

        for (Question q : questions) {
            Integer selectedIdx = answers != null ? answers.get(q.getId()) : null;
            boolean isCorrect = selectedIdx != null && selectedIdx == q.getCorrectOptionIndex();
            if (isCorrect) {
                score++;
            }

            reviews.add(new QuizResultResponse.QuestionReview(
                    q.getId(),
                    q.getQuestionText(),
                    q.getOptions(),
                    selectedIdx,
                    q.getCorrectOptionIndex(),
                    isCorrect,
                    q.getExplanation()
            ));
        }

        double percentage = totalQuestions > 0 ? ((double) score / totalQuestions) * 100.0 : 0.0;
        percentage = Math.round(percentage * 10.0) / 10.0;
        boolean passed = percentage >= quiz.getPassingScorePercentage();

        QuizAttempt attempt = new QuizAttempt();
        attempt.setStudentId(student.getId());
        attempt.setStudentName(student.getName());
        attempt.setQuizId(quizId);
        attempt.setCourseId(quiz.getCourseId());
        attempt.setScore(score);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setPercentage(percentage);
        attempt.setPassed(passed);
        attempt.setAnswers(answers);
        attempt.setAttemptedAt(Instant.now());

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        // Feedback message
        String feedback = passed
                ? "Outstanding! You scored " + percentage + "% and passed the assessment!"
                : "You scored " + percentage + "%. You need " + quiz.getPassingScorePercentage() + "% to pass. Please review the questions and try again!";

        // Send notification
        try {
            notificationService.createNotification(
                    student.getId(),
                    passed ? "Quiz Passed! 🎉" : "Quiz Attempt Recorded",
                    "You achieved " + percentage + "% on " + quiz.getTitle() + (passed ? ". Great job!" : ". Keep reviewing and try again!"),
                    "QUIZ",
                    "/learn/" + quiz.getCourseId() + "/quiz"
            );
        } catch (Exception ignored) {}

        QuizResultResponse response = new QuizResultResponse();
        response.setAttempt(savedAttempt);
        response.setScore(score);
        response.setTotalQuestions(totalQuestions);
        response.setPercentage(percentage);
        response.setPassed(passed);
        response.setPassingScorePercentage(quiz.getPassingScorePercentage());
        response.setFeedback(feedback);
        response.setQuestionReviews(reviews);

        return response;
    }

    public List<QuizAttempt> getStudentAttempts(String studentId) {
        return quizAttemptRepository.findByStudentId(studentId);
    }
}
