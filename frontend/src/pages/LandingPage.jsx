import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/common/CourseCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import {
  GraduationCap,
  Sparkles,
  Award,
  Video,
  Code2,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  BookOpen,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setPopularCourses(res.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const stats = [
    { label: 'Active Students', value: '10,000+', icon: Users, color: 'var(--primary)' },
    { label: 'Curated Courses', value: '250+', icon: BookOpen, color: 'var(--secondary)' },
    { label: 'Expert Instructors', value: '100+', icon: GraduationCap, color: 'var(--accent)' },
    { label: 'Completion Rate', value: '95%', icon: TrendingUp, color: 'var(--success)' },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: 'Expert Instructors',
      description: 'Learn directly from industry leaders, senior staff architects, and renowned tech educators.',
      color: 'var(--primary)',
    },
    {
      icon: Video,
      title: 'Interactive Video Learning',
      description: 'Ultra high-definition video modules, step-by-step code walkthroughs, and downloadable notes.',
      color: 'var(--secondary)',
    },
    {
      icon: TrendingUp,
      title: 'Live Progress Tracking',
      description: 'Real-time analytics, milestone checklists, and personal study streaks to keep you motivated.',
      color: 'var(--accent)',
    },
    {
      icon: BrainCircuit,
      title: 'AI-Powered Quizzes',
      description: 'Validate your comprehension with intelligent multi-tier quizzes, timers, and detailed explanations.',
      color: '#EC4899',
    },
    {
      icon: Award,
      title: 'Verified Certificates',
      description: 'Earn cryptographic, QR-verifiable digital certificates to showcase on LinkedIn and resumes.',
      color: 'var(--warning)',
    },
    {
      icon: Code2,
      title: 'Practical Hands-on Projects',
      description: 'Build real-world production applications, backend APIs, and distributed cloud microservices.',
      color: 'var(--success)',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Full Stack Engineer at Google',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      text: 'EduNexus transformed my career. The Java and Spring Boot microservices courses are unparalleled in quality and depth.',
      rating: 5,
    },
    {
      name: 'David Chen',
      role: 'Machine Learning Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'The AI and Python learning tracks are structured with exceptional clarity. The quizzes tested real understanding, not just memory.',
      rating: 5,
    },
    {
      name: 'Elena Rostova',
      role: 'Cloud Architect at AWS',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'The QR-verifiable certificates made a massive impression on my hiring team. EduNexus is hands-down the best modern LMS.',
      rating: 5,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 3rem 0',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(79, 70, 229, 0.15), transparent 70%)',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            border: '1px solid rgba(79, 70, 229, 0.2)'
          }}>
            <Sparkles size={16} />
            <span>Next-Generation EdTech Platform</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
          }}>
            Learn Skills.{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Build Your Future.
            </span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '750px',
            margin: '0 auto 2.5rem auto'
          }}>
            Master in-demand technologies through expert-led courses, interactive learning, practical projects, and personalized progress tracking.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link to="/courses" className="btn btn-primary btn-lg" style={{ boxShadow: 'var(--shadow-glow)' }}>
              Explore Courses <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Start Learning Free
            </Link>
          </div>

          {/* Animated Statistics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    fontFamily: 'Outfit, sans-serif',
                    color: stat.color,
                    marginBottom: '0.25rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. FEATURE HIGHLIGHTS */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Why EduNexus</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Engineered for Modern Tech Mastery
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Everything you need to go from beginner fundamentals to production-grade architectural mastery.
          </p>
        </div>

        <div className="grid-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="card card-interactive" style={{ padding: '2rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  backgroundColor: `${feature.color}15`,
                  color: feature.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Icon size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. POPULAR COURSES SECTION */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>Featured Tracks</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Explore Top Rated Courses</h2>
            <p style={{ color: 'var(--text-muted)' }}>Hand-crafted curriculum vetted by industry experts.</p>
          </div>
          <Link to="/courses" className="btn btn-outline">
            View All Courses ({popularCourses.length > 0 ? '10+' : '250+'}) &rarr;
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid-3">
            {popularCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* 4. LEARNING JOURNEY TIMELINE */}
      <section style={{ backgroundColor: 'var(--bg-subtle)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-secondary" style={{ marginBottom: '0.75rem' }}>How It Works</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Your 4-Step Journey to Tech Excellence
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Follow a proven path from conceptual understanding to verified enterprise credential.
            </p>
          </div>

          <div className="grid-4">
            {[
              { step: '01', title: 'Enroll & Plan', desc: 'Choose your desired tech track and set personal study goals.' },
              { step: '02', title: 'Watch & Practice', desc: 'Dive into interactive HD video lessons with hands-on source code.' },
              { step: '03', title: 'Test Your Mastery', desc: 'Complete comprehensive quizzes and submit assignments.' },
              { step: '04', title: 'Get Certified', desc: 'Earn verified credentials with public verification and QR proof.' },
            ].map((stepItem, i) => (
              <div key={i} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  fontFamily: 'Outfit, sans-serif',
                  color: 'var(--primary)',
                  opacity: 0.2,
                  lineHeight: 1,
                  marginBottom: '0.5rem'
                }}>
                  {stepItem.step}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{stepItem.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Student Success</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Trusted by 10,000+ Engineers Worldwide
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            See how EduNexus graduates landed roles at leading tech companies.
          </p>
        </div>

        <div className="grid-3">
          {testimonials.map((t, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <img src={t.avatar} alt={t.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
            Ready to Accelerate Your Career?
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
            Join thousands of developers leveling up their technical skills today. Get unlimited access to top-tier courses.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#FFFFFF', color: 'var(--primary)', fontWeight: 700 }}>
              Create Free Account
            </Link>
            <Link to="/courses" className="btn btn-outline btn-lg" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
