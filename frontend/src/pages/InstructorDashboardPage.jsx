import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RatingStars from '../components/common/RatingStars';
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  PlusCircle,
  TrendingUp,
  BarChart2,
  FolderKanban,
  Edit,
  Eye
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
} from 'recharts';

const enrollmentTrends = [
  { month: 'Jan', students: 45, revenue: 2200 },
  { month: 'Feb', students: 68, revenue: 3400 },
  { month: 'Mar', students: 95, revenue: 4750 },
  { month: 'Apr', students: 130, revenue: 6500 },
  { month: 'May', students: 180, revenue: 9000 },
  { month: 'Jun', students: 240, revenue: 12000 },
];

const InstructorDashboardPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 4.9,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    setLoading(true);
    try {
      // In a real API, call `/courses/instructor` or filter
      const res = await api.get('/courses');
      const instructorCourses = res.data; // or filtered by instructor
      setCourses(instructorCourses.slice(0, 5));

      const totalStudents = instructorCourses.reduce((acc, c) => acc + (c.enrolledStudents || 0), 0);
      const totalRev = instructorCourses.reduce((acc, c) => acc + ((c.enrolledStudents || 10) * (c.price || 49.99)), 0);

      setStats({
        totalCourses: instructorCourses.length,
        totalStudents: totalStudents || 450,
        totalRevenue: Math.round(totalRev) || 28400,
        averageRating: 4.85,
      });
    } catch (err) {
      console.error('Failed to load instructor data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner text="Loading Instructor Studio..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header with CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Instructor Studio
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Manage curriculum, publish interactive video lessons, and track student growth.
            </p>
          </div>

          <Link to="/instructor/courses/create" className="btn btn-primary btn-lg" style={{ boxShadow: 'var(--shadow-glow)' }}>
            <PlusCircle size={20} /> Create New Course
          </Link>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            color="var(--primary)"
            subtitle="Active courses published"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            color="var(--secondary)"
            change="22%"
            isPositive={true}
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="var(--success)"
            change="34%"
            isPositive={true}
          />
          <StatCard
            title="Average Rating"
            value={stats.averageRating.toFixed(2)}
            icon={Star}
            color="var(--warning)"
            subtitle="Based on 450+ reviews"
          />
        </div>

        {/* Recharts Analytics Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Revenue Growth Chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Monthly Revenue Growth</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gross revenue over 6 months</span>
              </div>
              <span className="badge badge-success">+34% YOY</span>
            </div>

            <div style={{ width: '100%', height: '230px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrends}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-subtle)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-subtle)" fontSize={12} tickLine={false} unit="$" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Enrollments Chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>New Student Enrollments</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly student onboarding</span>
              </div>
              <span className="badge badge-accent">+22% MoM</span>
            </div>

            <div style={{ width: '100%', height: '230px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-subtle)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-subtle)" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                    }}
                  />
                  <Bar dataKey="students" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Published Courses Table */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Active Courses</h3>
            <Link to="/instructor/courses" className="btn btn-outline btn-sm">
              Manage All Courses &rarr;
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Enrolled</th>
                  <th>Rating</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'}
                          alt={course.title}
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{course.title}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{course.category}</span></td>
                    <td><strong>{course.enrolledStudents || 120}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <RatingStars rating={course.rating || 4.9} size={14} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{course.rating?.toFixed(1) || '4.9'}</span>
                      </div>
                    </td>
                    <td>${course.price || 49.99}</td>
                    <td><span className="badge badge-success">Published</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/courses/${course.id}`} className="btn btn-ghost btn-sm" title="Preview Course">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/instructor/courses/${course.id}/edit`} className="btn btn-secondary btn-sm" title="Edit Course">
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboardPage;
