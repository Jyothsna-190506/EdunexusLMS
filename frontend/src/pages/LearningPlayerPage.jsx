import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  PlayCircle,
  FileText,
  Download,
  BookOpen,
  Award,
  ArrowLeft,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';

const LearningPlayerPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState(() => localStorage.getItem(`notes_${courseId}_${lessonId}`) || '');

  useEffect(() => {
    fetchCourseAndProgress();
  }, [courseId, lessonId]);

  const fetchCourseAndProgress = async () => {
    setLoading(true);
    try {
      // 1. Fetch Course
      const courseRes = await api.get(`/courses/${courseId}`);
      setCourse(courseRes.data);

      // 2. Fetch Progress
      let progData = null;
      try {
        const progRes = await api.get(`/progress/course/${courseId}`);
        setProgress(progRes.data);
        progData = progRes.data;
      } catch (e) {
        console.warn('Progress not initialized yet');
      }

      // 3. Find current lesson from modules
      let foundLesson = null;
      let firstLesson = null;
      for (const m of courseRes.data.modules || []) {
        for (const l of m.lessons || []) {
          if (!firstLesson) firstLesson = l;
          if (l.id === lessonId) {
            foundLesson = l;
            break;
          }
        }
        if (foundLesson) break;
      }

      if (foundLesson) {
        setCurrentLesson(foundLesson);
      } else if (firstLesson) {
        setCurrentLesson(firstLesson);
      }

      // 4. Fetch Quizzes for this course
      try {
        const quizRes = await api.get(`/quizzes/${courseId}`);
        setQuizzes(quizRes.data);
      } catch (e) {
        console.warn('No quizzes found for course');
      }
    } catch (err) {
      console.error('Error fetching course data:', err);
      showToast('Failed to load course player.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isLessonCompleted = (lId) => {
    return progress?.completedLessons?.includes(lId);
  };

  // Flatten all lessons in order
  const allLessons = [];
  course?.modules?.forEach((m) => {
    m.lessons?.forEach((l) => {
      allLessons.push({ ...l, moduleTitle: m.title });
    });
  });

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    try {
      const res = await api.post('/progress', {
        courseId,
        lessonId: currentLesson.id,
      });
      setProgress(res.data);
      showToast('Lesson marked as completed! 🎉', 'success');

      if (res.data.percentage >= 100) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast('Congratulations! You completed the course! 🏆', 'success');
      }

      // Move to next lesson if available
      if (nextLesson) {
        navigate(`/learn/${courseId}/${nextLesson.id}`);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
      showToast('Failed to save progress.', 'error');
    }
  };

  const handleSaveNotes = (e) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem(`notes_${courseId}_${lessonId}`, val);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Preparing course player..." />;
  }

  if (!course || !currentLesson) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Lesson Not Found</h2>
        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Could not load the requested lesson.</p>
        <Link to="/my-learning" className="btn btn-primary">Return to My Learning</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
      {/* Top Learning Bar */}
      <div style={{
        height: '60px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/my-learning" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <div style={{ borderLeft: '1px solid var(--border-color)', height: '24px' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '350px' }}>
            {course.title}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '150px', display: 'none', alignItems: 'center', gap: '0.5rem' }} className="desktop-progress">
            <ProgressBar percentage={progress?.percentage || 0} height={6} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{Math.round(progress?.percentage || 0)}%</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-secondary btn-sm"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            <span>{sidebarOpen ? 'Hide Syllabus' : 'Show Syllabus'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left/Center: Video Player & Lesson Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Video Container (16:9 responsive) */}
          <div style={{
            position: 'relative',
            paddingTop: '56.25%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: '#000000',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <ReactPlayer
              url={currentLesson.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              controls
              onEnded={handleMarkComplete}
            />
          </div>

          {/* Navigation & Completion Action Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <button
              onClick={() => prevLesson && navigate(`/learn/${courseId}/${prevLesson.id}`)}
              disabled={!prevLesson}
              className="btn btn-secondary btn-sm"
            >
              <ChevronLeft size={16} /> Previous Lesson
            </button>

            <button
              onClick={handleMarkComplete}
              className={`btn btn-sm ${isLessonCompleted(currentLesson.id) ? 'btn-success' : 'btn-primary'}`}
            >
              <CheckCircle size={16} />
              {isLessonCompleted(currentLesson.id) ? 'Completed' : 'Mark Complete & Next'}
            </button>

            <button
              onClick={() => nextLesson && navigate(`/learn/${courseId}/${nextLesson.id}`)}
              disabled={!nextLesson}
              className="btn btn-secondary btn-sm"
            >
              Next Lesson <ChevronRight size={16} />
            </button>
          </div>

          {/* Lesson Details & Interactive Tabs */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                  Lesson {currentIndex + 1} of {allLessons.length}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentLesson.title}</h2>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {currentLesson.description || 'In this comprehensive lesson, you will master the foundational core mechanics and hands-on coding techniques required for enterprise development.'}
            </p>

            {/* Quick Notes Scratchpad */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                <FileText size={16} color="var(--primary)" /> Personal Lesson Notes
              </div>
              <textarea
                className="form-control"
                placeholder="Type your notes here... (automatically saved in your browser)"
                value={notes}
                onChange={handleSaveNotes}
                rows={3}
                style={{ fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Right Syllabus & Quizzes Sidebar */}
        {sidebarOpen && (
          <aside style={{
            width: '360px',
            backgroundColor: 'var(--bg-card)',
            borderLeft: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            flexShrink: 0,
          }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Course Curriculum</h3>
              <ProgressBar percentage={progress?.percentage || 0} showLabel height={8} />
            </div>

            {/* Modules and Lessons List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {course.modules?.map((module, mIdx) => (
                <div key={mIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{
                    padding: '0.85rem 1.25rem',
                    backgroundColor: 'var(--bg-subtle)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                  }}>
                    Module {mIdx + 1}: {module.title}
                  </div>

                  {module.lessons?.map((lesson) => {
                    const isCurrent = lesson.id === currentLesson.id;
                    const isDone = isLessonCompleted(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => navigate(`/learn/${courseId}/${lesson.id}`)}
                        style={{
                          padding: '0.85rem 1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: isCurrent ? 'var(--primary-light)' : 'transparent',
                          borderLeft: isCurrent ? '4px solid var(--primary)' : '4px solid transparent',
                          transition: 'var(--transition)',
                        }}
                      >
                        {isDone ? (
                          <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0 }} />
                        ) : (
                          <Circle size={18} color="var(--text-subtle)" style={{ flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--primary)' : 'var(--text-main)' }}>
                          {lesson.title}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                          {lesson.duration || '10m'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Quizzes & Final Exam Section */}
              {quizzes.length > 0 && (
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-subtle)', margin: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    <HelpCircle size={18} color="var(--secondary)" /> Course Assessment
                  </div>
                  {quizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      to={`/quiz/${quiz.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}
                    >
                      Take Quiz: {quiz.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Certificate Claim Button (Active if progress >= 100) */}
              {(progress?.percentage || 0) >= 100 && (
                <div style={{ padding: '1.25rem', margin: '1rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--warning-light) 0%, var(--primary-light) 100%)', border: '1px solid var(--warning)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={18} color="var(--warning)" /> Course Finished!
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    You have unlocked your verified digital certificate.
                  </p>
                  <Link
                    to={`/verify-certificate/${courseId}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    View & Download Certificate &rarr;
                  </Link>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default LearningPlayerPage;
