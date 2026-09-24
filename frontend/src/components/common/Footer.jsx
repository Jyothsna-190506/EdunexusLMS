import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Github, Twitter, Linkedin, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <GraduationCap size={22} />
              </div>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontSize: '1.3rem',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                EduNexus
              </span>
            </Link>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              EduNexus is the world-class learning platform designed to empower aspiring developers, engineers, and tech leaders with hands-on, industry-ready skills.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon" style={{ width: '36px', height: '36px' }}>
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon" style={{ width: '36px', height: '36px' }}>
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon" style={{ width: '36px', height: '36px' }}>
                <Linkedin size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon" style={{ width: '36px', height: '36px' }}>
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Popular Categories */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>Popular Domains</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/courses?category=Artificial+Intelligence" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Artificial Intelligence & ML</Link></li>
              <li><Link to="/courses?category=Web+Development" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Full Stack Web Development</Link></li>
              <li><Link to="/courses?category=Java" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Java & Enterprise Microservices</Link></li>
              <li><Link to="/courses?category=Cloud+Computing" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cloud Computing & DevOps</Link></li>
              <li><Link to="/courses?category=Cybersecurity" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cybersecurity & Ethical Hacking</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/courses" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Course Catalog</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>About Us & Mission</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Help & Support</Link></li>
              <li><Link to="/verify-certificate/DEMO-CERT-123" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verify Certificates</Link></li>
              <li><Link to="/register" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Become an Instructor</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>Get in Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary)" />
                <span>support@edunexus.edu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--primary)" />
                <span>+1 (800) 555-NEXUS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" />
                <span>Silicon Valley, California, USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            &copy; {new Date().getFullYear()} EduNexus LMS Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Built with <Heart size={14} color="var(--danger)" fill="var(--danger)" /> for modern tech education
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
