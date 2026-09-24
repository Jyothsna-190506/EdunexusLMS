import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/common/Sidebar';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RatingStars from '../components/common/RatingStars';
import {
  Layers,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  BookOpen
} from 'lucide-react';

const AdminCoursesPage = () => {
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
      console.error('Failed to load courses for admin:', err);
      showToast('Failed to load catalog courses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course from the platform?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      showToast('Course removed from platform.', 'success');
    } catch (err) {
      console.error('Error deleting course:', err);
      showToast('Failed to delete course.', 'error');
    }
  };

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Course Catalog Moderation
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review all published courses, inspect curriculum, and moderate platform content.
          </p>
        </div>

        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by course title, instructor, or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th>Instructor</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Students</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'}
                            alt={c.title}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.title}</span>
                        </div>
                      </td>
                      <td>{c.instructorName || 'Lead Faculty'}</td>
                      <td><span className="badge badge-primary">{c.category}</span></td>
                      <td>${c.price || 0}</td>
                      <td><strong>{c.enrolledStudents || 0}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <RatingStars rating={c.rating || 4.9} size={14} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.rating?.toFixed(1) || '4.9'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Link to={`/courses/${c.id}`} className="btn btn-ghost btn-sm" title="View Course Page">
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                            title="Delete Course"
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

export default AdminCoursesPage;
