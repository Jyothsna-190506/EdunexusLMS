import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Target,
  Eye,
  ShieldCheck,
  Award,
  Users,
  Code2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section style={{
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-color)',
        padding: '5rem 0',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Our Mission</span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 800, marginBottom: '1.25rem' }}>
            Empowering the World's Next Generation of Tech Leaders
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            EduNexus is dedicated to bridging the gap between theoretical knowledge and real-world commercial software engineering through hands-on, high-impact learning.
          </p>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="container">
        <div className="grid-2">
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Target size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Our Mission</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.975rem' }}>
              To democratize access to elite tech education by delivering industry-vetted curriculums in Artificial Intelligence, Java Microservices, Web Engineering, and Cloud DevOps, giving every aspiring learner the tools to land transformative tech careers.
            </p>
          </div>

          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: 'var(--secondary-light)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Eye size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Our Vision</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.975rem' }}>
              To be the gold standard in verifiable online technical education where certificates represent verified code competency, practical mastery, and proven execution capability recognized by top global employers.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>The EduNexus Core Philosophy</h2>
          <p style={{ color: 'var(--text-muted)' }}>The guiding principles behind every course, quiz, and certificate on our platform.</p>
        </div>

        <div className="grid-3">
          {[
            {
              icon: Code2,
              title: 'Code-First Pragmatism',
              desc: 'We emphasize real coding over passive lectures. Build working microservices, frontend apps, and AI models from day one.',
            },
            {
              icon: ShieldCheck,
              title: 'Rigorous Verification',
              desc: 'Certificates are earned through strict assessments, interactive quizzes, and full course milestone completion.',
            },
            {
              icon: Sparkles,
              title: 'Continuous Innovation',
              desc: 'Our faculty regularly updates curriculums to match the latest enterprise frameworks, cloud architectures, and AI paradigms.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card" style={{ padding: '2rem' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                  <Icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
