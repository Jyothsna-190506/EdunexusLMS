import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import {
  GraduationCap,
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Menu,
  X,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import EduNexusLogo from './EduNexusLogo';

const Navbar = () => {
  const { user, isAuthenticated, logout, isStudent, isInstructor, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isInstructor) return '/instructor/dashboard';
    return '/student/dashboard';
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 99999,
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}>
        {/* Brand Logo */}
        <EduNexusLogo size={42} subtitle="LMS" withLink={true} />

        {/* Desktop Navigation Links (Role Aware) */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginLeft: '2rem',
        }} className="desktop-nav">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                style={{
                  color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Home
              </Link>
              <Link
                to="/courses"
                style={{
                  color: location.pathname.startsWith('/courses') ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname.startsWith('/courses') ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Courses
              </Link>
              <Link
                to="/about"
                style={{
                  color: location.pathname === '/about' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/about' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                About
              </Link>
              <Link
                to="/contact"
                style={{
                  color: location.pathname === '/contact' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/contact' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Contact
              </Link>
            </>
          ) : isStudent ? (
            <>
              <Link
                to="/"
                style={{
                  color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Home
              </Link>
              <Link
                to="/courses"
                style={{
                  color: location.pathname.startsWith('/courses') ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname.startsWith('/courses') ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Courses
              </Link>
              <Link
                to="/my-learning"
                style={{
                  color: location.pathname === '/my-learning' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/my-learning' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                My Learning
              </Link>
              <Link
                to="/certificates"
                style={{
                  color: location.pathname.startsWith('/certificates') ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname.startsWith('/certificates') ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Certificates
              </Link>
            </>
          ) : isInstructor ? (
            <>
              <Link
                to="/instructor/dashboard"
                style={{
                  color: location.pathname === '/instructor/dashboard' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/instructor/dashboard' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/instructor/courses"
                style={{
                  color: location.pathname === '/instructor/courses' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/instructor/courses' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                My Courses
              </Link>
              <Link
                to="/instructor/courses/create"
                style={{
                  color: location.pathname === '/instructor/courses/create' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/instructor/courses/create' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Create Course
              </Link>
              <Link
                to="/courses"
                style={{
                  color: location.pathname.startsWith('/courses') ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname.startsWith('/courses') ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Courses Catalog
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/admin/dashboard"
                style={{
                  color: location.pathname === '/admin/dashboard' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/admin/dashboard' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                style={{
                  color: location.pathname === '/admin/users' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/admin/users' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Users
              </Link>
              <Link
                to="/admin/courses"
                style={{
                  color: location.pathname === '/admin/courses' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/admin/courses' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Courses
              </Link>
              <Link
                to="/admin/categories"
                style={{
                  color: location.pathname === '/admin/categories' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/admin/categories' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Categories
              </Link>
              <Link
                to="/admin/reports"
                style={{
                  color: location.pathname === '/admin/reports' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: location.pathname === '/admin/reports' ? 700 : 500,
                  fontSize: '0.95rem'
                }}
              >
                Reports
              </Link>
            </>
          )}
        </nav>

        {/* Right Section: Theme Toggle, Notifications, User Menu / Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} color="var(--warning)" /> : <Moon size={20} />}
          </button>

          {/* Notifications Dropdown (If authenticated) */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }} ref={notifMenuRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="btn btn-ghost btn-icon"
                style={{ position: 'relative' }}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '18px',
                    height: '18px',
                    backgroundColor: 'var(--danger)',
                    color: '#fff',
                    borderRadius: '50%',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications popup */}
              {notifDropdownOpen && (
                <>
                  <div
                    onClick={() => setNotifDropdownOpen(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 99998,
                      background: 'transparent',
                      cursor: 'default',
                    }}
                  />
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: '320px',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                      padding: '1rem',
                      zIndex: 99999,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unreadCount} unread</span>
                    </div>
                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            style={{
                              padding: '0.6rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: notif.read ? 'transparent' : 'var(--primary-light)',
                              cursor: 'pointer',
                              marginBottom: '0.35rem',
                              fontSize: '0.85rem',
                              transition: 'background 0.2s',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <CheckCircle2 size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                              <div>
                                <div style={{ fontWeight: notif.read ? 400 : 600, color: 'var(--text-main)' }}>
                                  {notif.message}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Login & Sign Up Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }} className="auth-buttons">
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              Sign Up
            </Link>
          </div>

          {/* User Menu (If authenticated) */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setUserDropdownOpen((prev) => !prev);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px 4px 6px',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                aria-expanded={userDropdownOpen}
                aria-label="User account menu"
              >
                <img
                  src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                  alt={user?.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    backgroundColor: 'var(--bg-subtle)'
                  }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0] || 'My Account'}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" style={{ transform: userDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 99998,
                      background: 'transparent',
                      cursor: 'default',
                    }}
                  />
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: '240px',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                      padding: '0.6rem',
                      zIndex: 99999,
                      pointerEvents: 'auto',
                    }}
                  >
                  <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{user?.name || 'User'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                    <span className="badge badge-primary" style={{ marginTop: '0.4rem', fontSize: '0.68rem' }}>{user?.role || 'STUDENT'}</span>
                  </div>

                  <Link
                    to={getDashboardLink()}
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                    className="dropdown-item"
                  >
                    <LayoutDashboard size={16} color="var(--primary)" />
                    Dashboard
                  </Link>

                  {isStudent && (
                    <Link
                      to="/my-learning"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                      className="dropdown-item"
                    >
                      <BookOpen size={16} color="var(--secondary)" />
                      My Learning
                    </Link>
                  )}

                  {isStudent && (
                    <Link
                      to="/certificates"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                      className="dropdown-item"
                    >
                      <Award size={16} color="#F59E0B" />
                      My Certificates
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                    className="dropdown-item"
                  >
                    <User size={16} color="var(--accent)" />
                    Profile Details
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                    className="dropdown-item"
                  >
                    <User size={16} color="#10B981" />
                    Account Settings
                  </Link>

                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-icon mobile-menu-btn"
            style={{ display: 'none' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '72px',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 99,
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>Home</Link>
          <Link to="/courses" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>Courses</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>About</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>Contact</Link>
          
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>Login</Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Sign Up</Link>
          </div>

          {isAuthenticated && (
            <>
              <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--primary)', padding: '0.5rem 0' }}>Dashboard</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>Profile Details</Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>Account Settings</Link>
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem' }}>Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
