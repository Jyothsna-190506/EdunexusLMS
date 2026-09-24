import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/common/Sidebar';
import ProgressBar from '../components/common/ProgressBar';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { BookOpen, PlayCircle, Award, CheckCircle2, Clock, Sparkles } from 'lucide-react';

const MyLearningPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/enrollments/my');
      setEnrollments(res.data);

      try {
        const certRes = await api.get('/certificates/my');
        setCertificates(certRes.data);
      } catch (e) {
        console.warn('No certificates fetched');
      }
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const inProgressList = enrollments.filter((e) => !e.completed && (e.progress || 0) < 100);
  const completedList = enrollments.filter((e) => e.completed || (e.progress || 0) >= 100);

  let displayedList = enrollments;
  if (activeTab === 'in-progress') displayedList = inProgressList;
  if (activeTab === 'completed') displayedList = completedList;

  const findCertificateId = (courseId) => {
    const cert = certificates.find((c) => c.courseId === courseId);
    return cert ? cert.certificateId : null;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            My Learning Workspace
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track your course progress, resume interactive lessons, and view earned certifications.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Courses ({enrollments.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-progress')}
          >
            In Progress ({inProgressList.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedList.length})
          </button>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <SkeletonLoader count={4} />
        ) : displayedList.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Courses in this Tab</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {activeTab === 'completed'
                ? "You haven't completed any courses yet. Keep learning and finish all lessons & quizzes!"
                : "You haven't enrolled in any courses yet. Explore our top-tier course library!"}
            </p>
            <Link to="/courses" className="btn btn-primary">
              Explore Course Catalog
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {displayedList.map((item) => {
              const isDone = item.completed || (item.progress || 0) >= 100;
              const certId = findCertificateId(item.courseId);

              return (
                <div key={item.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', height: '170px', width: '100%', backgroundColor: 'var(--bg-subtle)' }}>
                    <img
                      src={item.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                      alt={item.courseTitle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {isDone && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'var(--success)',
                        color: '#fff',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <CheckCircle2 size={14} /> Completed
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      {item.courseTitle}
                    </h3>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Enrolled on {new Date(item.enrolledAt || Date.now()).toLocaleDateString()}
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <ProgressBar percentage={item.progress || 0} showLabel height={8} />
                    </div>

                    {/* Action */}
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link
                        to={`/learn/${item.courseId}/${item.currentLessonId || 'lesson-1'}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        <PlayCircle size={16} /> {isDone ? 'Review Course' : 'Continue Learning'}
                      </Link>

                      {isDone && (
                        <Link
                          to={`/verify-certificate/${certId || item.id}`}
                          className="btn btn-secondary btn-sm"
                          title="View Certificate"
                        >
                          <Award size={16} color="var(--warning)" /> Certificate
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyLearningPage;
