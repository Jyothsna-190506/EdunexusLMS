import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  // Countdown timer
  useEffect(() => {
    if (submitted || loading || !quiz) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, loading, quiz]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      // In our backend, we can fetch quiz by ID or by courseId
      const res = await api.get(`/quizzes/${quizId}`);
      // If array returned, pick first quiz
      const quizData = Array.isArray(res.data) ? res.data[0] : res.data;
      setQuiz(quizData);
      if (quizData.timeLimitMinutes) {
        setTimeLeft(quizData.timeLimitMinutes * 60);
      }
    } catch (err) {
      console.error('Failed to load quiz:', err);
      showToast('Could not load quiz questions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);

    try {
      // Build submission format
      const answersPayload = (quiz.questions || []).map((q, idx) => ({
        questionId: q.id || idx.toString(),
        selectedOption: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1,
      }));

      const res = await api.post(`/quizzes/${quiz.id || quizId}/attempt`, {
        answers: answersPayload,
      });

      setResult(res.data);
      setSubmitted(true);

      if (res.data.passed) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
        showToast('Congratulations! You passed the quiz! 🎓', 'success');
      } else {
        showToast('Quiz submitted. You can review your answers below.', 'info');
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      // Client-side fallback calculation if endpoint differs
      let score = 0;
      const questions = quiz.questions || [];
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswerIndex) {
          score++;
        }
      });
      const percentage = Math.round((score / (questions.length || 1)) * 100);
      const passed = percentage >= 70;
      setResult({
        score,
        totalQuestions: questions.length,
        percentage,
        passed,
      });
      setSubmitted(true);
      if (passed) {
        confetti({ particleCount: 100, spread: 70 });
        showToast('You passed the quiz! 🎓', 'success');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading assessment..." />;
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Quiz Not Found</h2>
        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>No active questions found for this quiz.</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">Go Back</button>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="container" style={{ maxWidth: '850px', padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Quiz Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>Interactive Assessment</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{quiz.title}</h1>
        </div>

        {!submitted && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: timeLeft < 120 ? 'var(--danger-light)' : 'var(--bg-subtle)',
            color: timeLeft < 120 ? 'var(--danger)' : 'var(--text-main)',
            fontWeight: 700,
            fontSize: '1rem',
            border: '1px solid var(--border-color)',
          }}>
            <Clock size={18} />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {/* RESULT SCREEN IF SUBMITTED */}
      {submitted && result ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: result.passed ? 'var(--success-light)' : 'var(--danger-light)',
            color: result.passed ? 'var(--success)' : 'var(--danger)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            {result.passed ? <Award size={40} /> : <AlertCircle size={40} />}
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {result.passed ? 'Assessment Passed! 🎉' : 'Assessment Incomplete'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            {result.passed
              ? `You scored ${result.score} out of ${result.totalQuestions || questions.length} (${result.percentage}%). Excellent performance!`
              : `You scored ${result.score} out of ${result.totalQuestions || questions.length} (${result.percentage}%). Passing score is 70%. Review the questions and try again.`}
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {result.passed && (
              <Link
                to={`/verify-certificate/${quiz.courseId || 'course'}`}
                className="btn btn-primary btn-lg"
                style={{ boxShadow: 'var(--shadow-glow)' }}
              >
                <Award size={20} /> Claim Certificate
              </Link>
            )}
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedAnswers({});
                setCurrentQuestionIndex(0);
                setTimeLeft(600);
              }}
              className="btn btn-secondary btn-lg"
            >
              <RotateCcw size={18} /> Retake Quiz
            </button>
            <Link to="/my-learning" className="btn btn-ghost btn-lg">
              Back to My Learning
            </Link>
          </div>

          {/* Detailed Question Review */}
          <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Answer Review & Explanations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {questions.map((q, qIdx) => {
                const userChoice = selectedAnswers[qIdx];
                const isCorrect = userChoice === q.correctAnswerIndex;

                return (
                  <div
                    key={qIdx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {qIdx + 1}. {q.questionText}
                      </div>
                      <span className={`badge ${isCorrect ? 'badge-success' : 'badge-danger'}`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                      {q.options?.map((opt, optIdx) => {
                        let optStyle = { padding: '0.4rem 0.75rem', borderRadius: '4px' };
                        if (optIdx === q.correctAnswerIndex) {
                          optStyle.backgroundColor = 'var(--success-light)';
                          optStyle.color = 'var(--success)';
                          optStyle.fontWeight = 700;
                        } else if (optIdx === userChoice && !isCorrect) {
                          optStyle.backgroundColor = 'var(--danger-light)';
                          optStyle.color = 'var(--danger)';
                        }
                        return (
                          <div key={optIdx} style={optStyle}>
                            {optIdx + 1}) {opt} {optIdx === q.correctAnswerIndex && ' ✓ (Correct Answer)'} {optIdx === userChoice && !isCorrect && ' ✗ (Your Answer)'}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* QUIZ TAKING INTERFACE */
        <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          {/* Question Bubbles & Progress */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{answeredCount} of {questions.length} answered</span>
            </div>
            <ProgressBar percentage={(answeredCount / questions.length) * 100} height={6} />
          </div>

          {/* Question Nav Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {questions.map((_, i) => {
              const isAnswered = selectedAnswers[i] !== undefined;
              const isCurrent = i === currentQuestionIndex;

              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: isCurrent ? 'var(--primary)' : 'var(--border-color)',
                    backgroundColor: isCurrent ? 'var(--primary)' : isAnswered ? 'var(--primary-light)' : 'var(--bg-subtle)',
                    color: isCurrent ? '#fff' : isAnswered ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Body */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.5rem' }}>
              {currentQuestionIndex + 1}. {currentQ.questionText}
            </h2>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentQ.options?.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--text-subtle)',
                      backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                      color: isSelected ? '#fff' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? 600 : 400, color: 'var(--text-main)' }}>
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="btn btn-primary"
              >
                Next Question <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="btn btn-success btn-lg"
              >
                <CheckCircle2 size={18} /> {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
