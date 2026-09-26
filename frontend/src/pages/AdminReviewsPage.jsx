import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import RatingStars from '../components/common/RatingStars';
import { useNotification } from '../context/NotificationContext';
import {
  MessageSquare,
  Star,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Eye,
  ShieldCheck
} from 'lucide-react';

const mockReviews = [
  {
    id: 'rev-1',
    userName: 'Sophia Chen',
    userEmail: 'sophia.c@example.com',
    courseTitle: 'Full-Stack Modern Web Architecture',
    rating: 5,
    comment: 'Exceptional curriculum! The Three.js visual notebook concepts and architectural breakdown blew me away. Best course on EduNexus.',
    date: '2026-03-18',
    status: 'APPROVED',
    flagged: false
  },
  {
    id: 'rev-2',
    userName: 'David Miller',
    userEmail: 'david.m@example.com',
    courseTitle: 'Advanced React & Three.js Interactive Design',
    rating: 5,
    comment: 'High production quality and very clear explanations. I built my portfolio in 3 days after taking this.',
    date: '2026-03-14',
    status: 'APPROVED',
    flagged: false
  },
  {
    id: 'rev-3',
    userName: 'Anonymous Learner',
    userEmail: 'anon@spambot.xyz',
    courseTitle: 'Enterprise Java & Spring Boot Microservices',
    rating: 1,
    comment: 'Visit my spam site for free crypto tokens 100x return guaranteed!',
    date: '2026-03-12',
    status: 'PENDING',
    flagged: true
  },
  {
    id: 'rev-4',
    userName: 'Lucas Garcia',
    userEmail: 'lucas.g@example.com',
    courseTitle: 'Deep Learning & Neural Network Architectures',
    rating: 4,
    comment: 'Great course overall. Would love additional homework notebooks on PyTorch transformers.',
    date: '2026-03-10',
    status: 'APPROVED',
    flagged: false
  }
];

const AdminReviewsPage = () => {
  const { showToast } = useNotification();
  const [reviews, setReviews] = useState(mockReviews);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const handleApprove = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'APPROVED', flagged: false } : r));
    if (showToast) showToast('Review approved and published', 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this review permanently?')) {
      setReviews(reviews.filter(r => r.id !== id));
      if (showToast) showToast('Review removed from catalog', 'info');
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchSearch = r.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    if (ratingFilter === 'all') return matchSearch;
    if (ratingFilter === 'flagged') return matchSearch && r.flagged;
    return matchSearch && r.rating === parseInt(ratingFilter);
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <MessageSquare size={28} color="var(--primary)" />
              Review Moderation
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Audit learner feedback, moderate comments, and ensure academic community standards.
            </p>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', minWidth: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search reviews by course or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'flagged', '5', '4', '3', '1'].map(f => (
              <button
                key={f}
                onClick={() => setRatingFilter(f)}
                className={`btn ${ratingFilter === f ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
              >
                {f === 'all' ? 'All Reviews' : f === 'flagged' ? '⚠️ Flagged' : `${f} Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="card"
              style={{
                padding: '1.5rem',
                borderLeft: rev.flagged ? '4px solid var(--danger)' : '1px solid var(--border-color)',
                backgroundColor: rev.flagged ? 'rgba(239, 68, 68, 0.04)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>{rev.userName}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({rev.userEmail})</span>
                    {rev.flagged && (
                      <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Flagged Spam</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                    Course: {rev.courseTitle}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <RatingStars rating={rev.rating} size={16} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                </div>
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.5, margin: '0.75rem 0 1.25rem', backgroundColor: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px' }}>
                "{rev.comment}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                {rev.flagged && (
                  <button onClick={() => handleApprove(rev.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={15} /> Approve & Clear Flag
                  </button>
                )}
                <button onClick={() => handleDelete(rev.id)} className="btn btn-ghost" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', color: 'var(--danger)' }}>
                  <Trash2 size={15} /> Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminReviewsPage;
