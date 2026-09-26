import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import { useNotification } from '../context/NotificationContext';
import {
  Settings,
  Shield,
  Server,
  Mail,
  Database,
  Save,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Lock,
  Download
} from 'lucide-react';

const AdminSettingsPage = () => {
  const { showToast } = useNotification();
  const [saving, setSaving] = useState(false);

  const [platformConfig, setPlatformConfig] = useState({
    siteName: 'EduNexus LMS',
    tagline: 'Learn. Build. Grow.',
    supportEmail: 'support@edunexus.org',
    enablePublicRegistration: true,
    requireEmailVerification: false,
    maintenanceMode: false,
    jwtTokenExpiryHours: 72,
    maxUploadSizeMB: 50,
    defaultCurrency: 'USD ($)',
    autoApproveCourses: false
  });

  const handleToggle = (key) => {
    setPlatformConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (showToast) showToast('System settings saved and applied', 'success');
    }, 600);
  };

  const handleBackupExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(platformConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `edunexus-system-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (showToast) showToast('System backup manifest downloaded', 'info');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sliders size={28} color="var(--primary)" />
              System Configuration
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Platform runtime controls, access policies, authentication tokens, and database backups.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleBackupExport} className="btn btn-secondary">
              <Download size={16} />
              Export System Backup
            </button>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary">
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* General Platform Identity */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={20} color="var(--primary)" />
              General Platform Identity
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Platform Name</label>
                <input
                  type="text"
                  className="input"
                  value={platformConfig.siteName}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, siteName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  className="input"
                  value={platformConfig.tagline}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, tagline: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Support Email</label>
                <input
                  type="email"
                  className="input"
                  value={platformConfig.supportEmail}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, supportEmail: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Default Currency</label>
                <input
                  type="text"
                  className="input"
                  value={platformConfig.defaultCurrency}
                  onChange={(e) => setPlatformConfig({ ...platformConfig, defaultCurrency: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Security & Access Policies */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="#10B981" />
              Security, Registration & Access Policies
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'enablePublicRegistration', label: 'Public Student Registration', desc: 'Allow any user on the web to register an account and start taking courses.' },
                { key: 'autoApproveCourses', label: 'Auto-Publish Instructor Courses', desc: 'When enabled, courses created by verified instructors bypass admin review.' },
                { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Restrict platform access to administrators only while undergoing upgrades.' }
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
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={platformConfig[item.key]}
                    onChange={() => handleToggle(item.key)}
                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Database & Storage */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={20} color="#7C3AED" />
              Database & Infrastructure
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Database Cluster</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>MongoDB Atlas</div>
                <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>Connected (Healthy)</span>
              </div>

              <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Backend Runtime</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>Spring Boot 3.3.4 (Java 26)</div>
                <span className="badge badge-primary" style={{ marginTop: '0.5rem' }}>Active Port 8080</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminSettingsPage;
