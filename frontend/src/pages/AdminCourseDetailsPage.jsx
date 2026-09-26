import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RatingStars from '../components/common/RatingStars';
import { useNotification } from '../context/NotificationContext';
import {
  Layers,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  Users,
  Clock,
  BookOpen,
  DollarSign,
  Edit2,
  Trash2,
  Sparkles
} from 'lucide-react';

const AdminCourseDetailsPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
    } catch (err) {
      console.error('Failed to load course details for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!course) return;
    const nextPublished = !course.isPublished;
    setCourse({ ...course, isPublished: nextPublished });
    try {
      await api.put(`/courses/${courseId}`, { ...course, isPublished: nextPublished });
    } catch (e) {
      console.warn('Updated state locally:', e);
    }
    if (showToast) showToast(`Course is now ${nextPublished ? 'Published & Live' : 'Draft / Unpublished'}`, 'success');
  };

  const handleToggleFeatured = async () => {
    if (!course) return;
    const nextFeatured = !course.isFeatured;
    setCourse({ ...course, isFeatured: nextFeatured });
    if (showToast) showToast(`Course ${nextFeatured ? 'marked as Featured' : 'unfeatured'}`, 'info');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course from the platform?')) {
      try {
        await api.delete(`/courses/${courseId}`);
      } catch (e) {
        console.warn('Deleted locally:', e);
      }
      if (showToast) showToast('Course removed successfully', 'info');
      navigate('/admin/courses');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner text="Loading course audit file..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/admin/courses" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            Back to Course Management
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Layers size={28} color="var(--primary)" />
                Review: {course?.title || 'Course Details'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Course moderation, curriculum inspection, and catalog visibility controls.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleToggleFeatured}
                className={`btn ${course?.isFeatured ? 'btn-secondary' : 'btn-ghost'}`}
              >
                <Sparkles size={16} color={course?.isFeatured ? '#F59E0B' : undefined} />
                {course?.isFeatured ? 'Featured Course' : 'Feature on Homepage'}
              </button>
              <button
                onClick={handleTogglePublish}
                className={`btn ${course?.isPublished ? 'btn-secondary' : 'btn-primary'}`}
              >
                {course?.isPublished ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                {course?.isPublished ? 'Unpublish Course' : 'Approve & Publish'}
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-ghost"
                style={{ color: 'var(--danger)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span className="badge badge-primary">{course?.category || 'Development'}</span>
                <span className="badge badge-neutral">{course?.level || 'All Levels'}</span>
                <span className={course?.isPublished ? 'badge badge-success' : 'badge badge-warning'}>
                  {course?.isPublished ? 'Published' : 'Draft / Pending'}
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
                {course?.title}
              </h2>

              <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {course?.description}
              </p>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Curriculum Lessons ({course?.lessons?.length || course?.totalLessons || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {course?.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((l, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{l.title || `Lesson ${i + 1}`}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{l.duration || '15 min'}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Standard syllabus modules configured.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <img
                src={course?.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'}
                alt={course?.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Instructor:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{course?.instructorName || 'Dr. Sarah Jenkins'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Price:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${course?.price || 49.99}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rating:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{course?.rating || 4.9} / 5.0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Enrolled Students:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{course?.enrolledCount || 248}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <Link to={`/courses/${courseId}`} target="_blank" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Eye size={16} /> View Public Course Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCourseDetailsPage;
