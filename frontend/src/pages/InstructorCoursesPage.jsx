import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/common/Sidebar';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RatingStars from '../components/common/RatingStars';
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  BookOpen,
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const InstructorCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useNotification();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to load instructor courses:', err);
      showToast('Error loading courses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      showToast('Course successfully deleted.', 'success');
    } catch (err) {
      console.error('Failed to delete course:', err);
      showToast(err.response?.data?.message || 'Failed to delete course.', 'error');
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Manage Courses
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Edit course curriculum, manage lessons, and track student registrations.
            </p>
          </div>

          <Link to="/instructor/courses/create" className="btn btn-primary">
            <PlusCircle size={18} /> Add New Course
          </Link>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {/* Courses Table */}
        {loading ? (
          <SkeletonLoader count={4} />
        ) : filteredCourses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Courses Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Create your first course to begin teaching students worldwide.
            </p>
            <Link to="/instructor/courses/create" className="btn btn-primary">
              Create Course
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Students</th>
                    <th>Rating</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'}
                            alt={c.title}
                            style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {c.modules?.length || 0} modules &bull; {c.duration || '12 hrs'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-primary">{c.category}</span></td>
                      <td><span className="badge badge-accent">{c.difficulty}</span></td>
                      <td><strong>{c.enrolledStudents || 0}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <RatingStars rating={c.rating || 4.9} size={14} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.rating?.toFixed(1) || '4.9'}</span>
                        </div>
                      </td>
                      <td>${c.price || 0}</td>
                      <td><span className="badge badge-success">Live</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Link to={`/courses/${c.id}`} className="btn btn-ghost btn-sm" title="Preview">
                            <Eye size={16} />
                          </Link>
                          <Link to={`/instructor/courses/${c.id}/edit`} className="btn btn-secondary btn-sm" title="Edit">
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorCoursesPage;
