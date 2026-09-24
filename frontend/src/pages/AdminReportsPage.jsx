import React from 'react';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/common/StatCard';
import { BarChart3, TrendingUp, DollarSign, Award, Users, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const reportData = [
  { category: 'AI & ML', completions: 420, revenue: 21000 },
  { category: 'Web Dev', completions: 580, revenue: 29000 },
  { category: 'Java Microservices', completions: 390, revenue: 19500 },
  { category: 'Cloud & DevOps', completions: 310, revenue: 15500 },
  { category: 'Cybersecurity', completions: 260, revenue: 13000 },
  { category: 'Python Data Science', completions: 480, revenue: 24000 },
];

const AdminReportsPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Platform Analytics & Reports
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Comprehensive performance audits, category revenues, and completion metrics.
            </p>
          </div>

          <button
            onClick={() => alert('Exporting platform audit CSV...')}
            className="btn btn-secondary"
          >
            <Download size={16} /> Export CSV Audit
          </button>
        </div>

        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <StatCard
            title="Avg Course Completion Rate"
            value="94.8%"
            icon={TrendingUp}
            color="var(--success)"
            change="3.2%"
            isPositive={true}
          />
          <StatCard
            title="Monthly Payouts Dispatched"
            value="$42,800"
            icon={DollarSign}
            color="var(--primary)"
            subtitle="To verified instructors"
          />
          <StatCard
            title="Certificates Issued"
            value="2,440"
            icon={Award}
            color="var(--warning)"
            change="19%"
            isPositive={true}
          />
        </div>

        {/* Category Revenue and Completions Chart */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Revenue & Completions by Domain</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cross-category platform distribution</span>
            </div>
            <span className="badge badge-primary">Q3 Performance</span>
          </div>

          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="category" stroke="var(--text-subtle)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-subtle)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                  }}
                />
                <Bar dataKey="completions" fill="var(--primary)" name="Certificates Earned" radius={[6, 6, 0, 0]} />
                <Bar dataKey="revenue" fill="var(--accent)" name="Gross Revenue ($)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReportsPage;
