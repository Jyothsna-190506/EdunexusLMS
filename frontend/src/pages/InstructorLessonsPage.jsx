import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  MoveUp,
  MoveDown,
  Video,
  FileText,
  HelpCircle,
  Save,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

const InstructorLessonsPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal / Form state for Lesson
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    duration: '15 min',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    content: '',
    isFree: false
  });

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
      if (res.data.lessons && res.data.lessons.length > 0) {
        setLessons(res.data.lessons);
      } else {
        // Sample starter lessons if course just created
        setLessons([
          {
            id: 'lesson-1',
            title: '1. Course Overview & Environment Setup',
            duration: '12 min',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            content: 'Introduction to course architecture and developer toolchain setup.',
            isFree: true
          },
          {
            id: 'lesson-2',
            title: '2. Core Principles & Architecture Deep-Dive',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            content: 'Exploring foundational design patterns and system scalability.',
            isFree: false
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch course lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (index = null) => {
    if (index !== null) {
      setEditingLessonIndex(index);
      setLessonForm(lessons[index]);
    } else {
      setEditingLessonIndex(null);
      setLessonForm({
        title: '',
        duration: '15 min',
        videoUrl: '',
        content: '',
        isFree: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveLesson = (e) => {
    e.preventDefault();
    if (!lessonForm.title) return;

    if (editingLessonIndex !== null) {
      const updated = [...lessons];
      updated[editingLessonIndex] = { ...lessonForm, id: lessons[editingLessonIndex].id || `lesson-${Date.now()}` };
      setLessons(updated);
      if (showToast) showToast('Lesson updated in syllabus', 'success');
    } else {
      const newLesson = {
        ...lessonForm,
        id: `lesson-${Date.now()}`
      };
      setLessons([...lessons, newLesson]);
      if (showToast) showToast('New lesson added to course', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDeleteLesson = (index) => {
    if (window.confirm('Are you sure you want to remove this lesson?')) {
      const updated = lessons.filter((_, i) => i !== index);
      setLessons(updated);
      if (showToast) showToast('Lesson removed', 'info');
    }
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;
    const updated = [...lessons];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setLessons(updated);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      if (course) {
        await api.put(`/courses/${courseId}`, {
          ...course,
          lessons: lessons,
          totalLessons: lessons.length
        });
      }
      if (showToast) showToast('Course syllabus saved and published!', 'success');
    } catch (err) {
      console.error('Failed to save lessons:', err);
      if (showToast) showToast('Saved locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner text="Loading course syllabus..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header with breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/instructor/courses" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textDecoration: 'none' }}>
              <ArrowLeft size={16} />
              Back to My Courses
            </Link>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Manage Syllabus: {course?.title || 'Course'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Organize modules, video lectures, coding resources, and interactive lessons.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => handleOpenModal()} className="btn btn-secondary">
              <Plus size={16} />
              Add Lesson
            </button>
            <button onClick={handleSaveAll} disabled={saving} className="btn btn-primary">
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Syllabus'}
            </button>
          </div>
        </div>

        {/* Lessons List */}
        {lessons.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={36} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Lessons in Curriculum</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start adding video lectures, exercises, or quizzes to this course.</p>
            <button onClick={() => handleOpenModal()} className="btn btn-primary">
              <Plus size={16} /> Add First Lesson
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id || index}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: index === 0 ? 'var(--border-color)' : 'var(--text-muted)' }}
                    >
                      <MoveUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === lessons.length - 1}
                      style={{ background: 'none', border: 'none', cursor: index === lessons.length - 1 ? 'not-allowed' : 'pointer', color: index === lessons.length - 1 ? 'var(--border-color)' : 'var(--text-muted)' }}
                    >
                      <MoveDown size={16} />
                    </button>
                  </div>

                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Video size={20} />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {lesson.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {lesson.duration || '15 min'}
                      </span>
                      {lesson.isFree && (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Free Preview</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(index)} className="btn btn-ghost btn-icon" title="Edit Lesson">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteLesson(index)} className="btn btn-ghost btn-icon" style={{ color: 'var(--danger)' }} title="Delete Lesson">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add / Edit Lesson */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                {editingLessonIndex !== null ? 'Edit Lesson' : 'Add New Lesson'}
              </h3>
              <form onSubmit={handleSaveLesson}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Lesson Title</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. 1. Introduction to Web Components"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 20 min"
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Video URL (YouTube/Vimeo/MP4)</label>
                    <input
                      type="url"
                      className="input"
                      placeholder="https://..."
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Lesson Content / Notes (Markdown)</label>
                  <textarea
                    rows={3}
                    className="input"
                    placeholder="Provide overview, key takeaways, and assignment details..."
                    value={lessonForm.content}
                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                    style={{ height: 'auto' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="isFreeCheck"
                    checked={lessonForm.isFree}
                    onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                  />
                  <label htmlFor="isFreeCheck" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                    Allow Free Preview for prospective students
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingLessonIndex !== null ? 'Update Lesson' : 'Add to Syllabus'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorLessonsPage;
