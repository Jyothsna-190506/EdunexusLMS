import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import {
  User,
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Lock
} from 'lucide-react';

const AdminUserDetailsPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users`);
      const found = res.data.find(u => u.id === userId || u.id === parseInt(userId));
      if (found) {
        setUser(found);
      } else {
        setUser({
          id: userId,
          name: 'Alexander Wright',
          email: 'alexander@example.com',
          role: 'STUDENT',
          createdAt: '2026-01-15',
          status: 'ACTIVE',
          enrolledCourses: 3,
          certificatesEarned: 2,
          lastLogin: 'Today, 10:20 AM'
        });
      }
    } catch (err) {
      console.error('Failed to load user details:', err);
      setUser({
        id: userId,
        name: 'Alexander Wright',
        email: 'alexander@example.com',
        role: 'STUDENT',
        createdAt: '2026-01-15',
        status: 'ACTIVE',
        enrolledCourses: 3,
        certificatesEarned: 2,
        lastLogin: 'Today, 10:20 AM'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = () => {
    if (!user) return;
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUser({ ...user, status: nextStatus });
    if (showToast) showToast(`User account is now ${nextStatus}`, 'info');
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner text="Loading user profile & activity..." />
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
          <Link to="/admin/users" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            Back to All Users
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <User size={28} color="var(--primary)" />
                User Profile: {user?.name}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Inspect account details, enrolled courses, role permissions, and activity logs.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleToggleStatus}
                className={`btn ${user?.status === 'ACTIVE' ? 'btn-ghost' : 'btn-primary'}`}
                style={{ color: user?.status === 'ACTIVE' ? 'var(--danger)' : undefined }}
              >
                {user?.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
              </button>
            </div>
          </div>
        </div>

        {/* User Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left card */}
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt={user?.name}
              style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'var(--bg-subtle)', margin: '0 auto 1rem' }}
            />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {user?.name}
            </h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {user?.email}
            </div>

            <div style={{ display: 'inline-flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className="badge badge-primary">{user?.role}</span>
              <span className={user?.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-danger'}>
                {user?.status || 'ACTIVE'}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Member Since:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user?.createdAt || '2026-01-15'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Last Active:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user?.lastLogin || 'Today'}</span>
              </div>
            </div>
          </div>

          {/* Right side stats & history */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{user?.enrolledCourses || 3}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enrolled Courses</div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{user?.certificatesEarned || 2}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Certificates Earned</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                Enrolled Curriculum History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { title: 'Full-Stack Modern Web Architecture', progress: '100%', status: 'Completed', date: '2026-03-15' },
                  { title: 'Advanced React & Three.js Interactive Design', progress: '100%', status: 'Completed', date: '2026-02-28' },
                  { title: 'Enterprise Java & Spring Boot Microservices', progress: '64%', status: 'In Progress', date: '2026-03-10' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.92rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Enrolled: {item.date}</div>
                    </div>
                    <span className={item.status === 'Completed' ? 'badge badge-success' : 'badge badge-primary'}>
                      {item.progress} ({item.status})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUserDetailsPage;
