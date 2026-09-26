import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProgressBar from '../components/common/ProgressBar';
import {
  Users,
  Search,
  ArrowLeft,
  Download,
  Mail,
  Award,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';

const mockStudents = [
  {
    id: 's-1',
    name: 'Emma Watson',
    email: 'emma.w@example.com',
    enrolledDate: '2026-03-01',
    progress: 100,
    completed: true,
    quizScore: '98%',
    certificateIssued: true
  },
  {
    id: 's-2',
    name: 'David Miller',
    email: 'david.m@example.com',
    enrolledDate: '2026-03-04',
    progress: 75,
    completed: false,
    quizScore: '85%',
    certificateIssued: false
  },
  {
    id: 's-3',
    name: 'Sophia Chen',
    email: 'sophia.c@example.com',
    enrolledDate: '2026-03-10',
    progress: 40,
    completed: false,
    quizScore: 'In progress',
    certificateIssued: false
  },
  {
    id: 's-4',
    name: 'Lucas Garcia',
    email: 'lucas.g@example.com',
    enrolledDate: '2026-03-14',
    progress: 90,
    completed: false,
    quizScore: '92%',
    certificateIssued: false
  },
  {
    id: 's-5',
    name: 'Amina Al-Mansoor',
    email: 'amina.m@example.com',
    enrolledDate: '2026-03-15',
    progress: 100,
    completed: true,
    quizScore: '100%',
    certificateIssued: true
  }
];

const InstructorStudentsPage = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourseAndStudents();
  }, [courseId]);

  const fetchCourseAndStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
      setStudents(mockStudents);
    } catch (err) {
      console.error('Failed to load course students:', err);
      setStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Student Name,Email,Enrollment Date,Progress %,Quiz Score,Certificate Issued\n'];
    const rows = students.map(s => `"${s.name}","${s.email}","${s.enrolledDate}","${s.progress}%","${s.quizScore}","${s.certificateIssued ? 'Yes' : 'No'}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Students-${course?.title || 'Course'}.csv`;
    a.click();
  };

  const filteredStudents = students.filter(s => {
    const matchQuery = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    if (filter === 'completed') return matchQuery && s.completed;
    if (filter === 'in-progress') return matchQuery && !s.completed;
    return matchQuery;
  });

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner text="Loading enrolled learners..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/instructor/courses" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textDecoration: 'none' }}>
              <ArrowLeft size={16} />
              Back to My Courses
            </Link>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Users size={28} color="var(--primary)" />
              Enrolled Learners: {course?.title || 'Course'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Monitor student engagement, lesson completions, quiz performance, and certificates.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleExportCSV} className="btn btn-secondary">
              <Download size={16} />
              Export CSV Report
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', minWidth: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'in-progress', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem', textTransform: 'capitalize' }}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Students Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Student</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Enrolled On</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Progress</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quiz Score</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '1.2rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`}
                        alt={s.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-subtle)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{s.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {s.enrolledDate}
                  </td>
                  <td style={{ padding: '1.2rem 1.25rem', minWidth: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <ProgressBar progress={s.progress} size="sm" color={s.completed ? '#10B981' : '#4F46E5'} />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', width: '36px' }}>
                        {s.progress}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 1.25rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {s.quizScore}
                  </td>
                  <td style={{ padding: '1.2rem 1.25rem' }}>
                    {s.certificateIssued ? (
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={12} /> Issued
                      </span>
                    ) : (
                      <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} /> Pending
                      </span>
                    )}
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

export default InstructorStudentsPage;
