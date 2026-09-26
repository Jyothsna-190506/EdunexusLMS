import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/common/StatCard';
import RatingStars from '../components/common/RatingStars';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  DollarSign,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const enrollmentTrendData = [
  { month: 'Oct', enrollments: 35, revenue: 1400 },
  { month: 'Nov', enrollments: 58, revenue: 2320 },
  { month: 'Dec', enrollments: 82, revenue: 3280 },
  { month: 'Jan', enrollments: 120, revenue: 4800 },
  { month: 'Feb', enrollments: 195, revenue: 7800 },
  { month: 'Mar', enrollments: 248, revenue: 9920 },
];

const lessonEngagementData = [
  { module: 'Mod 1: Intro', completed: 248, dropoff: 0 },
  { module: 'Mod 2: Fundamentals', completed: 235, dropoff: 5 },
  { module: 'Mod 3: Deep Dive', completed: 210, dropoff: 10 },
  { module: 'Mod 4: Architecture', completed: 188, dropoff: 12 },
  { module: 'Mod 5: Final Project', completed: 165, dropoff: 15 },
];

const InstructorAnalyticsPage = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAnalytics();
  }, [courseId]);

  const fetchCourseAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
    } catch (err) {
      console.error('Failed to load course analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner text="Crunching course metrics & engagement..." />
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
              <BarChart3 size={28} color="var(--primary)" />
              Analytics: {course?.title || 'Course'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Real-time analytics for learner retention, revenue velocity, and quiz comprehension.
            </p>
          </div>
        </div>

        {/* Top KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <StatCard
            title="Total Enrolled"
            value="248"
            change="+28% this month"
            isPositive={true}
            icon={Users}
            color="primary"
          />
          <StatCard
            title="Completion Rate"
            value="68.5%"
            change="+4.2% vs avg"
            isPositive={true}
            icon={CheckCircle2}
            color="success"
          />
          <StatCard
            title="Avg Quiz Score"
            value="91.4%"
            change="Strong mastery"
            isPositive={true}
            icon={Award}
            color="secondary"
          />
          <StatCard
            title="Gross Revenue"
            value="$9,920"
            change="+32% Q1"
            isPositive={true}
            icon={DollarSign}
            color="accent"
          />
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Enrollment Trend */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--primary)" />
              Enrollment Velocity & Growth
            </h3>
            <div style={{ height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrendData}>
                  <defs>
                    <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
                  <Area type="monotone" dataKey="enrollments" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorEnroll)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Module Engagement & Retention */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10B981" />
              Curriculum Module Retention
            </h3>
            <div style={{ height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lessonEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="module" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
                  <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Course Reviews Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={18} color="#F59E0B" />
            Student Ratings & Feedback (4.9 / 5.0)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {[
              { name: 'Sarah Jenkins', role: 'Frontend Engineer', comment: 'The interactive lessons and deep architectural patterns made this the best course I have taken all year!', rating: 5 },
              { name: 'Michael Chang', role: 'Full-Stack Developer', comment: 'Clear explanations, hands-on quizzes, and high production value. Highly recommended.', rating: 5 },
              { name: 'Elena Rostova', role: 'UI Architect', comment: 'The balance between practical exercises and theoretical rigor is exceptional.', rating: 5 },
            ].map((review, i) => (
              <div key={i} style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{review.name}</div>
                  <RatingStars rating={review.rating} size={14} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{review.role}</div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorAnalyticsPage;
