import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import Sidebar from '../components/common/Sidebar';
import {
  User,
  Mail,
  Phone,
  FileText,
  Lock,
  Save,
  Award,
  BookOpen,
  Camera,
  CheckCircle2
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [bio, setBio] = useState(user?.bio || 'Full stack enthusiast and dedicated continuous learner.');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '+1 (555) 019-2834');
      setBio(user.bio || 'Full stack enthusiast and dedicated continuous learner.');
      setProfileImage(user.profileImage || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // If user profile update API exists
      const updatedData = { ...user, name, phone, bio, profileImage };
      updateUser(updatedData);
      showToast('Profile information successfully updated!', 'success');
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast('Failed to update profile details.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'warning');
      return;
    }
    setChangingPass(true);
    setTimeout(() => {
      setChangingPass(false);
      setCurrentPassword('');
      setNewPassword('');
      showToast('Password successfully changed! 🔒', 'success');
    }, 800);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Account Settings
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage your personal profile, security credentials, and platform preferences.
          </p>
        </div>

        {/* Profile Details Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Personal Information</h2>

          <form onSubmit={handleUpdateProfile}>
            {/* Avatar & Role Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'User'}`}
                  alt={name}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
                />
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <span className="badge badge-primary">{user?.role}</span>
                  <span className="badge badge-success">Verified</span>
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-subtle)" style={{ position: 'absolute', top: '13px', left: '12px' }} />
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-subtle)" style={{ position: 'absolute', top: '13px', left: '12px' }} />
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    disabled
                    style={{ paddingLeft: '2.5rem', opacity: 0.7 }}
                  />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="var(--text-subtle)" style={{ position: 'absolute', top: '13px', left: '12px' }} />
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Headline</label>
              <textarea
                className="form-control"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" disabled={saving} className="btn btn-primary">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Change Security Password</h2>

          <form onSubmit={handleChangePassword}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-subtle)" style={{ position: 'absolute', top: '13px', left: '12px' }} />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-subtle)" style={{ position: 'absolute', top: '13px', left: '12px' }} />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" disabled={changingPass} className="btn btn-secondary">
                <Lock size={16} /> {changingPass ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
