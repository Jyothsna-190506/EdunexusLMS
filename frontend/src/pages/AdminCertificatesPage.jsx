import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useNotification } from '../context/NotificationContext';
import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Download,
  Filter,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

const mockCertificatesAudit = [
  {
    id: 'CERT-EDX-2026-9041',
    studentName: 'Alexander Wright',
    studentEmail: 'alexander@example.com',
    courseTitle: 'Full-Stack Modern Web Architecture',
    issueDate: '2026-03-15',
    grade: '98%',
    status: 'VALID'
  },
  {
    id: 'CERT-EDX-2026-8812',
    studentName: 'Emma Watson',
    studentEmail: 'emma.w@example.com',
    courseTitle: 'Advanced React & Three.js Interactive Design',
    issueDate: '2026-03-14',
    grade: '95%',
    status: 'VALID'
  },
  {
    id: 'CERT-EDX-2026-7519',
    studentName: 'Amina Al-Mansoor',
    studentEmail: 'amina.m@example.com',
    courseTitle: 'Enterprise Java & Spring Boot Microservices',
    issueDate: '2026-03-08',
    grade: '100%',
    status: 'VALID'
  },
  {
    id: 'CERT-EDX-2026-6102',
    studentName: 'David Miller',
    studentEmail: 'david.m@example.com',
    courseTitle: 'Deep Learning & Neural Network Architectures',
    issueDate: '2026-02-20',
    grade: '92%',
    status: 'REVOKED'
  }
];

const AdminCertificatesPage = () => {
  const { showToast } = useNotification();
  const [certs, setCerts] = useState(mockCertificatesAudit);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleToggleStatus = (id) => {
    setCerts(certs.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'VALID' ? 'REVOKED' : 'VALID';
        if (showToast) showToast(`Certificate ${id} status updated to ${nextStatus}`, 'info');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const filteredCerts = certs.filter(c => {
    const matchSearch = c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'all') return matchSearch;
    return matchSearch && c.status === statusFilter;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Award size={28} color="var(--primary)" />
              Certificates Registry
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Complete tamper-evident registry of all digital credentials issued on EduNexus LMS.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', minWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by Credential ID, student, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'VALID', 'REVOKED'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
              >
                {s === 'all' ? 'All Credentials' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Certificate ID</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Student</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Course</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Issue Date</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCerts.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1.2rem 1.25rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                    {c.id}
                  </td>
                  <td style={{ padding: '1.2rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>{c.studentName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.studentEmail}</div>
                  </td>
                  <td style={{ padding: '1.2rem 1.25rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {c.courseTitle}
                  </td>
                  <td style={{ padding: '1.2rem 1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {c.issueDate}
                  </td>
                  <td style={{ padding: '1.2rem 1.25rem' }}>
                    {c.status === 'VALID' ? (
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    ) : (
                      <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <XCircle size={12} /> Revoked
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1.2rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Link
                        to={`/verify-certificate/${c.id}`}
                        target="_blank"
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <ExternalLink size={14} /> Verify
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(c.id)}
                        className={`btn ${c.status === 'VALID' ? 'btn-ghost' : 'btn-primary'}`}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: c.status === 'VALID' ? 'var(--danger)' : undefined }}
                      >
                        {c.status === 'VALID' ? 'Revoke' : 'Reissue'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminCertificatesPage;
