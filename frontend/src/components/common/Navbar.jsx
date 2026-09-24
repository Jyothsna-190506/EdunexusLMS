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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      zIndex: 100,
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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            <GraduationCap size={26} />
          </div>
          <div>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontSize: '1.4rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              EduNexus
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--accent)',
              marginLeft: '4px',
              textTransform: 'uppercase'
            }}>
              LMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          marginLeft: '2rem',
        }} className="desktop-nav">
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
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '320px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '1rem',
                  zIndex: 200,
                }}>
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
              )}
            </div>
          )}

          {/* User Menu / Auth Buttons */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
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
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '220px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.5rem',
                  zIndex: 200,
                }}>
                  <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                    <span className="badge badge-primary" style={{ marginTop: '0.35rem' }}>{user?.role}</span>
                  </div>

                  <Link
                    to={getDashboardLink()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
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
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
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

                  <Link
                    to="/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                    className="dropdown-item"
                  >
                    <User size={16} color="var(--accent)" />
                    Profile Settings
                  </Link>

                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
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
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
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
          <Link to="/" style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>Home</Link>
          <Link to="/courses" style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>Courses</Link>
          <Link to="/about" style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>About</Link>
          <Link to="/contact" style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} style={{ fontWeight: 600, color: 'var(--primary)', padding: '0.5rem 0' }}>Dashboard</Link>
              <Link to="/profile" style={{ fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>Profile</Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem' }}>Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ flex: 1 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
