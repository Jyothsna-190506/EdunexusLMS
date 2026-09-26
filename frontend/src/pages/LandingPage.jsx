import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MengToSketchbookLandingPage } from '../shaders/landing-pages/LandingPages';
import '../shaders/threeui.css';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

// Robust Error Boundary for Canvas / Frame Loading
class SketchbookErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Sketchbook Canvas fallback triggered:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const LandingPage = () => {
  const { isAuthenticated, isAdmin, isInstructor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'EDUNEXUS_NAVIGATE' && event.data.path) {
        navigate(event.data.path);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isInstructor) return '/instructor/dashboard';
    return '/student/dashboard';
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#ece7dc', overflow: 'hidden' }}>
      <SketchbookErrorBoundary
        fallback={
          <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#ece7dc',
            color: '#2b2721',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1.2rem',
              borderRadius: '999px',
              background: 'rgba(43,39,33,0.08)',
              color: '#2b2721',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid rgba(43,39,33,0.15)'
            }}>
              <BookOpen size={16} />
              <span>EduNexus Learning Sketchbook</span>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5.5vw, 4rem)', fontWeight: 400, marginBottom: '1rem', letterSpacing: '0.01em' }}>
              Learn. Build. Grow.
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(43,39,33,0.7)', maxWidth: '680px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
              An interactive learning ecosystem designed to help you discover knowledge, build practical skills, practice concepts, track progress, and achieve your goals.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/courses" style={{ background: '#2b2721', color: '#ece7dc', padding: '12px 28px', borderRadius: '999px', textDecoration: 'none', fontWeight: 600 }}>
                Explore Courses &rarr;
              </Link>
              <Link to={isAuthenticated ? getDashboardPath() : '/register'} style={{ border: '1px solid rgba(43,39,33,0.3)', color: '#2b2721', padding: '12px 28px', borderRadius: '999px', textDecoration: 'none', fontWeight: 600 }}>
                {isAuthenticated ? 'Go to Dashboard' : 'Start Learning Free'}
              </Link>
            </div>
          </div>
        }
      >
        <div className="shader-frame" style={{ width: '100%', height: '100%', position: 'relative' }}>
          <MengToSketchbookLandingPage
            headingFont="instrument-serif"
            bodyFont="newsreader"
            headingWeight="400"
            bodyWeight="400"
            primaryColor="#2b2721"
            headingSize={30}
            bodySize={20}
            headingLetterSpacing={0.010}
          />
        </div>
      </SketchbookErrorBoundary>
    </div>
  );
};

export default LandingPage;
