import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useNotification } from '../context/NotificationContext';
import {
  Bell,
  CheckCircle2,
  BookOpen,
  Award,
  AlertCircle,
  Clock,
  Trash2,
  CheckCheck,
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';

const mockSystemNotifications = [
  {
    id: 'notif-1',
    title: 'New Lesson Available',
    message: 'Module 4: "State Management with Zustand & Redux Toolkit" has been released in Full-Stack Web Development.',
    type: 'COURSE_UPDATE',
    read: false,
    timestamp: '10 minutes ago',
    link: '/courses'
  },
  {
    id: 'notif-2',
    title: 'Quiz Passed with Distinction!',
    message: 'Congratulations! You scored 96% on the React Hooks & Concurrency Assessment.',
    type: 'ASSESSMENT',
    read: false,
    timestamp: '2 hours ago',
    link: '/certificates'
  },
  {
    id: 'notif-3',
    title: 'Certificate Issued',
    message: 'Your official certificate for "Advanced Three.js Interactive Web Design" is ready to download.',
    type: 'CERTIFICATE',
    read: true,
    timestamp: 'Yesterday',
    link: '/certificates'
  },
  {
    id: 'notif-4',
    title: 'Weekly Study Goal Met',
    message: 'You achieved 6.5 hours of active learning this week. Keep up the great streak!',
    type: 'SYSTEM',
    read: true,
    timestamp: '3 days ago',
    link: '/dashboard'
  }
];

const NotificationsPage = () => {
  const { notifications: contextNotifs, markAsRead, showToast } = useNotification();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'course', 'system'

  // Combine backend/context notifications with fallback initial notifications if empty
  const allNotifs = contextNotifs && contextNotifs.length > 0 ? contextNotifs : mockSystemNotifications;
  const [localNotifs, setLocalNotifs] = useState(allNotifs);

  const handleMarkAllRead = () => {
    setLocalNotifs(prev => prev.map(n => ({ ...n, read: true })));
    localNotifs.forEach(n => {
      if (!n.read && markAsRead) markAsRead(n.id);
    });
    if (showToast) showToast('All notifications marked as read', 'success');
  };

  const handleClearAll = () => {
    setLocalNotifs([]);
    if (showToast) showToast('Notification feed cleared', 'info');
  };

  const handleMarkSingle = (id) => {
    setLocalNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (markAsRead) markAsRead(id);
  };

  const filteredNotifs = localNotifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'course') return n.type === 'COURSE_UPDATE' || n.type === 'ASSESSMENT';
    if (filter === 'system') return n.type === 'SYSTEM' || n.type === 'CERTIFICATE';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'COURSE_UPDATE':
        return <BookOpen size={20} color="#4F46E5" />;
      case 'ASSESSMENT':
        return <CheckCircle2 size={20} color="#10B981" />;
      case 'CERTIFICATE':
        return <Award size={20} color="#F59E0B" />;
      default:
        return <Info size={20} color="#06B6D4" />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Bell size={28} color="var(--primary)" />
              Notifications Center
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Stay updated on course releases, quiz results, certificates, and academic announcements.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={handleMarkAllRead} className="btn btn-secondary" style={{ height: '40px', fontSize: '0.85rem' }}>
              <CheckCheck size={16} />
              Mark All Read
            </button>
            <button onClick={handleClearAll} className="btn btn-ghost" style={{ height: '40px', fontSize: '0.85rem', color: 'var(--danger)' }}>
              <Trash2 size={16} />
              Clear Feed
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          {[
            { id: 'all', label: 'All Notifications' },
            { id: 'unread', label: 'Unread Only' },
            { id: 'course', label: 'Courses & Quizzes' },
            { id: 'system', label: 'Credentials & System' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`btn ${filter === tab.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '20px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-muted)' }}>
              <Bell size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Notifications</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              You're completely caught up! New updates will appear here automatically.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  backgroundColor: notif.read ? 'var(--bg-card)' : 'var(--primary-light, rgba(79, 70, 229, 0.04))',
                  borderLeft: notif.read ? '1px solid var(--border-color)' : '4px solid var(--primary)',
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getIcon(notif.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {notif.title}
                      {!notif.read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                      )}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} />
                      {notif.timestamp || 'Just now'}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {notif.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {notif.link && (
                      <Link to={notif.link} className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
                        View Details
                        <ArrowRight size={14} />
                      </Link>
                    )}
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkSingle(notif.id)}
                        className="btn btn-ghost"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
