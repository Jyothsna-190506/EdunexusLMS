import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { Clock, Users, BookOpen } from 'lucide-react';

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    instructorName,
    category,
    difficulty = 'Beginner',
    duration = '12 hours',
    thumbnail,
    price = 0,
    discount = 0,
    rating = 4.8,
    reviewsCount = 120,
    enrolledStudents = 350,
  } = course;

  const discountedPrice = discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price;

  return (
    <div className="card card-interactive" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      overflow: 'hidden',
      height: '100%',
    }}>
      {/* Thumbnail Container */}
      <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        {/* Category & Difficulty Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px',
        }}>
          <span className="badge badge-primary" style={{ backdropFilter: 'blur(8px)', boxShadow: 'var(--shadow-sm)' }}>
            {category || 'Tech'}
          </span>
          <span className="badge badge-accent" style={{ backdropFilter: 'blur(8px)' }}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Course Info */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '0.4rem',
          lineHeight: '1.4',
          color: 'var(--text-main)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.8rem'
        }}>
          {title}
        </h3>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          By <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{instructorName || 'EduNexus Faculty'}</span>
        </div>

        {/* Rating and Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F59E0B' }}>
            {rating?.toFixed(1) || '4.8'}
          </span>
          <RatingStars rating={rating || 4.8} size={14} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            ({reviewsCount || enrolledStudents || 0})
          </span>
        </div>

        {/* Course Meta (Duration & Students) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          marginTop: 'auto',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} />
            <span>{duration}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={14} />
            <span>{enrolledStudents} learners</span>
          </div>
        </div>

        {/* Price & Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {price === 0 ? (
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--success)' }}>Free</span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  ${discountedPrice}
                </span>
                {discount > 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                    ${price}
                  </span>
                )}
              </div>
            )}
          </div>
          <Link to={`/courses/${id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
