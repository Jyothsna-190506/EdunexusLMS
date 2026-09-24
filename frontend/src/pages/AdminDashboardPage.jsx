import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981'];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 25,
    students: 18,
    instructors: 5,
    totalCourses: 10,
    totalEnrollments: 480,
    totalRevenue: 64200,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      const usersRes = await api.get('/admin/users');
      const usersList = usersRes.data || [];
      setRecentUsers(usersList.slice(0, 5));

      const studentsCount = usersList.filter((u) => u.role === 'STUDENT').length;
      const instructorsCount = usersList.filter((u) => u.role === 'INSTRUCTOR').length;

      // 2. Fetch Courses
      const coursesRes = await api.get('/courses');
      const coursesList = coursesRes.data || [];

      // 3. Try platform stats endpoint if available
      try {
        const statsRes = await api.get('/admin/statistics');
        setStats(statsRes.data);
      } catch (e) {
        setStats({
          totalUsers: usersList.length || 25,
          students: studentsCount || 18,
          instructors: instructorsCount || 5,
          totalCourses: coursesList.length || 10,
          totalEnrollments: 480,
          totalRevenue: 64200,
        });
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const userDistribution = [
    { name: 'Students', value: stats.students || 18 },
    { name: 'Instructors', value: stats.instructors || 5 },
    { name: 'Admins', value: (stats.totalUsers - stats.students - stats.instructors) || 2 },
  ];

  const monthlyEnrollmentTrend = [
    { month: 'Jan', enrollments: 65, revenue: 3200 },
    { month: 'Feb', enrollments: 90, revenue: 4500 },
    { month: 'Mar', enrollments: 140, revenue: 7000 },
    { month: 'Apr', enrollments: 210, revenue: 10500 },
    { month: 'May', enrollments: 320, revenue: 16000 },
    { month: 'Jun', enrollments: 480, revenue: 24000 },
  ];

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner text="Loading Executive Admin Suite..." />
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={16} /> Global Administration Control
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Platform Operations & Analytics</h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/users" className="btn btn-secondary btn-sm">
              <Users size={16} /> Users Management
            </Link>
            <Link to="/admin/courses" className="btn btn-primary btn-sm">
              <Layers size={16} /> Course Moderation
            </Link>
          </div>
        </div>

        {/* 6 Metric Stat Cards */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <StatCard
            title="Total Registered Users"
            value={stats.totalUsers || 25}
            icon={Users}
            color="var(--primary)"
            change="18%"
            isPositive={true}
          />
          <StatCard
            title="Active Students"
            value={stats.students || 18}
            icon={GraduationCap}
            color="var(--accent)"
            subtitle="Enrolled in active tracks"
          />
          <StatCard
            title="Verified Instructors"
            value={stats.instructors || 5}
            icon={UserCheck}
            color="var(--secondary)"
            subtitle="Curating masterclasses"
          />
          <StatCard
            title="Catalog Courses"
            value={stats.totalCourses || 10}
            icon={BookOpen}
            color="var(--primary)"
            subtitle="Active published courses"
          />
          <StatCard
            title="Total Enrollments"
            value={stats.totalEnrollments || 480}
            icon={TrendingUp}
            color="var(--warning)"
            change="29%"
            isPositive={true}
          />
          <StatCard
            title="Platform Gross Revenue"
            value={`$${(stats.totalRevenue || 64200).toLocaleString()}`}
            icon={DollarSign}
            color="var(--success)"
            change="31%"
            isPositive={true}
          />
        </div>

        {/* Analytics Charts Split Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Monthly Growth Area Chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Platform Enrollments & Scale</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student registrations per month</span>
              </div>
              <span className="badge badge-success">+42% Overall</span>
            </div>

            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyEnrollmentTrend}>
                  <defs>
                    <linearGradient id="colorAdminEnr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area type="monotone" dataKey="enrollments" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorAdminEnr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Role Distribution Pie Chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>User Role Demographics</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role allocation breakdown</span>
              </div>
            </div>

            <div style={{ width: '100%', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent User Registrations</h3>
            <Link to="/admin/users" className="btn btn-outline btn-sm">
              View All Users &rarr;
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={u.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || 'User'}`}
                          alt={u.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'INSTRUCTOR' ? 'badge-secondary' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'DISABLED' ? 'badge-danger' : 'badge-success'}`}>
                        {u.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recently'}
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

export default AdminDashboardPage;
