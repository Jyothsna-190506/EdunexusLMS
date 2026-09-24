import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';
import CourseCard from '../components/common/CourseCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  PlayCircle,
  TrendingUp,
  ArrowRight,
  Flame,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

const weeklyStudyData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.8 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4.2 },
  { day: 'Fri', hours: 3.0 },
  { day: 'Sat', hours: 5.5 },
  { day: 'Sun', hours: 4.0 },
];

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch student enrollments
        const enrollRes = await api.get('/enrollments/my');
        setEnrollments(enrollRes.data);

        // Fetch recommendations (courses)
        const coursesRes = await api.get('/courses');
        setRecommendedCourses(coursesRes.data.slice(0, 3));

        // Fetch certificates
        try {
          const certRes = await api.get('/certificates/my');
          setCertificates(certRes.data);
        } catch (e) {
          console.warn('Could not fetch certificates:', e);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completed || e.progress >= 100).length;
  const inProgressEnrollments = enrollments.filter((e) => !e.completed && e.progress < 100);
  const activeCourse = inProgressEnrollments[0] || enrollments[0];

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner text="Loading your learning workspace..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          color: '#FFFFFF',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Flame size={14} color="#FBBF24" fill="#FBBF24" /> 5 Day Learning Streak!
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', maxWidth: '600px' }}>
              You've completed <strong style={{ color: '#FFFFFF' }}>82%</strong> of your weekly goal. Keep going to earn your next verified certificate!
            </p>
          </div>

          <Link to="/courses" className="btn btn-secondary" style={{ backgroundColor: '#FFFFFF', color: 'var(--primary)', fontWeight: 700 }}>
            Browse New Courses
          </Link>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <StatCard
            title="Enrolled Courses"
            value={totalEnrolled}
            icon={BookOpen}
            color="var(--primary)"
            subtitle={`${inProgressEnrollments.length} currently active`}
          />
          <StatCard
            title="Completed Courses"
            value={completedCourses}
            icon={CheckCircle}
            color="var(--success)"
            subtitle="100% finished syllabus"
          />
          <StatCard
            title="Learning Hours"
            value="24.5 hrs"
            icon={Clock}
            color="var(--accent)"
            change="14%"
            isPositive={true}
          />
          <StatCard
            title="Certificates Earned"
            value={certificates.length || completedCourses}
            icon={Award}
            color="var(--warning)"
            subtitle="Verified credentials"
          />
        </div>

        {/* Continue Learning Spotlight (if active enrolled course exists) */}
        {activeCourse && (
          <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="badge badge-primary">Continue Learning</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Last accessed today</span>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '220px', height: '125px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={activeCourse.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                  alt={activeCourse.courseTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {activeCourse.courseTitle}
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <ProgressBar percentage={activeCourse.progress || 0} showLabel height={8} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Current: <strong style={{ color: 'var(--text-main)' }}>{activeCourse.currentLessonTitle || 'Module 1: Introduction'}</strong>
                  </span>
                  <Link
                    to={`/learn/${activeCourse.courseId}/${activeCourse.currentLessonId || 'lesson-1'}`}
                    className="btn btn-primary btn-sm"
                  >
                    <PlayCircle size={16} /> Resume Lesson
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics & Activity Split Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Weekly Learning Hours Chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Study Activity (Hours/Day)</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total: 24.5 hrs this week</span>
              </div>
              <span className="badge badge-accent">+18% this week</span>
            </div>

            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStudyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--text-subtle)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-subtle)" fontSize={12} tickLine={false} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="hours" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Recent Learning Timeline
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { title: 'Completed Lesson: Spring Security JWT Filter', time: '2 hours ago', icon: CheckCircle, color: 'var(--success)' },
                { title: 'Passed Quiz: Machine Learning Basics (95%)', time: 'Yesterday', icon: Award, color: 'var(--warning)' },
                { title: 'Enrolled in Full Stack Java Development', time: '3 days ago', icon: BookOpen, color: 'var(--primary)' },
                { title: 'Earned Certificate: React Development Masterclass', time: 'Last week', icon: Award, color: 'var(--secondary)' },
              ].map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: `${activity.color}15`,
                      color: activity.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {activity.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommended Courses Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Recommended For You</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Based on your tech learning interests</p>
            </div>
            <Link to="/courses" className="btn btn-outline btn-sm">
              View All &rarr;
            </Link>
          </div>

          <div className="grid-3">
            {recommendedCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboardPage;
