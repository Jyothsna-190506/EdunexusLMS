import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import {
  Settings,
  User,
  Lock,
  Bell,
  Palette,
  Shield,
  Save,
  Moon,
  Sun,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);

  // Account State
  const [accountForm, setAccountForm] = useState({
    name: user?.name || 'Alexander Wright',
    email: user?.email || 'alexander@example.com',
    bio: 'Software engineer passionate about full-stack web architectures and modern AI applications.',
    headline: 'Full-Stack Developer & Learner',
    language: 'English (US)'
  });

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState({
    emailLessonUpdates: true,
    emailQuizReminders: true,
    emailCertificates: true,
    emailAnnouncements: false,
    marketingEmails: false
  });

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (showToast) showToast('Account settings updated successfully!', 'success');
    }, 600);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      if (showToast) showToast('New passwords do not match', 'error');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      if (showToast) showToast('Password changed successfully!', 'success');
    }, 600);
  };

  const handlePrefToggle = (key) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    if (showToast) showToast('Preferences updated', 'info');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Settings size={28} color="var(--primary)" />
            Settings & Preferences
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Manage your account credentials, notifications, visual theme, and security preferences.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Settings Tabs */}
          <div className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {[
              { id: 'account', label: 'Account Profile', icon: User },
              { id: 'security', label: 'Password & Security', icon: Lock },
              { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
              { id: 'notifications', label: 'Notification Preferences', icon: Bell },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-main)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Settings Content Area */}
          <div className="card" style={{ padding: '2rem' }}>
            {/* Account Settings */}
            {activeTab === 'account' && (
              <form onSubmit={handleAccountSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  Account Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="input"
                      value={accountForm.name}
                      onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="input"
                      value={accountForm.email}
                      onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Professional Headline</label>
                  <input
                    type="text"
                    className="input"
                    value={accountForm.headline}
                    onChange={(e) => setAccountForm({ ...accountForm, headline: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Bio / About Me</label>
                  <textarea
                    rows={4}
                    className="input"
                    value={accountForm.bio}
                    onChange={(e) => setAccountForm({ ...accountForm, bio: e.target.value })}
                    style={{ height: 'auto' }}
                  />
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.65rem 1.75rem' }}>
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* Password & Security */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  Change Password & Security
                </h3>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Current Password</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    className="input"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      className="input"
                      placeholder="Minimum 8 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      className="input"
                      placeholder="Confirm new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
                  <input
                    type="checkbox"
                    id="showPass"
                    checked={showPasswords}
                    onChange={() => setShowPasswords(!showPasswords)}
                  />
                  <label htmlFor="showPass" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    Show password characters
                  </label>
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.65rem 1.75rem' }}>
                  <Lock size={16} />
                  {saving ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  Visual Theme & Preferences
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      Dark Mode
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      Reduce eye strain in low-light learning environments.
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {isDark ? <Sun size={18} color="var(--warning)" /> : <Moon size={18} />}
                    {isDark ? 'Light Theme' : 'Dark Theme'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      Motion & Animations
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      Standard smooth transitions and micro-interactions enabled.
                    </p>
                  </div>
                  <span className="badge badge-success">Optimized</span>
                </div>
              </div>
            )}

            {/* Notifications Preferences */}
            {activeTab === 'notifications' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  Email & App Notifications
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { key: 'emailLessonUpdates', label: 'New Course Lessons', desc: 'Receive updates when new content or exercises are published in your enrolled courses.' },
                    { key: 'emailQuizReminders', label: 'Quiz & Milestone Alerts', desc: 'Get notifications when you pass quizzes and achieve milestone scores.' },
                    { key: 'emailCertificates', label: 'Certificate Issuance', desc: 'Receive instant email delivery when a course completion certificate is generated.' },
                    { key: 'emailAnnouncements', label: 'Platform Announcements', desc: 'Stay updated on new platform features and major curriculum additions.' },
                  ].map(item => (
                    <div
                      key={item.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-subtle)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.label}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifPrefs[item.key]}
                        onChange={() => handlePrefToggle(item.key)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
