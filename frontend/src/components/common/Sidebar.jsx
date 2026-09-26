import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Award,
  PlusCircle,
  FolderKanban,
  Users,
  Layers,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  Bell,
  FolderTree,
  MessageSquare,
  Sliders
} from 'lucide-react';

const Sidebar = () => {
  const { user, isStudent, isInstructor, isAdmin } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/my-learning', icon: BookOpen, label: 'My Learning' },
    { to: '/courses', icon: Compass, label: 'Explore Courses' },
    { to: '/certificates', icon: Award, label: 'Certificates' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/profile', icon: User, label: 'My Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const instructorLinks = [
    { to: '/instructor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/instructor/courses', icon: FolderKanban, label: 'Manage Courses' },
    { to: '/instructor/courses/create', icon: PlusCircle, label: 'Create Course' },
    { to: '/courses', icon: Compass, label: 'Browse Catalog' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/courses', icon: Layers, label: 'Course Moderation' },
    { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { to: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
    { to: '/admin/certificates', icon: Award, label: 'Certificates' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' },
    { to: '/admin/settings', icon: Sliders, label: 'System Settings' },
    { to: '/profile', icon: User, label: 'Admin Profile' },
  ];

  let links = studentLinks;
  if (isAdmin) links = adminLinks;
  else if (isInstructor) links = instructorLinks;

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      minHeight: 'calc(100vh - 72px)',
      flexShrink: 0,
    }}>
      {/* User profile mini badge */}
      <div style={{
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-subtle)',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <img
          src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
          alt={user?.name}
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name}
          </div>
          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
            {user?.role}
          </span>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '0 0.75rem', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
        Navigation
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                transition: 'var(--transition)',
                textDecoration: 'none',
                boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
              })}
            >
              <Icon size={17} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Support box at bottom */}
      <div style={{
        marginTop: 'auto',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%)',
        border: '1px solid var(--border-color)',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
          <HelpCircle size={16} /> Need Assistance?
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Check our help guides or reach out to tech support.
        </p>
        <NavLink to="/contact" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
          Contact Support &rarr;
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
