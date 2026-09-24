import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, maxRating = 5, size = 16, interactive = false, onRatingChange }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <Star
            key={index}
            size={size}
            fill={isFilled ? '#F59E0B' : 'transparent'}
            color={isFilled ? '#F59E0B' : 'var(--text-subtle)'}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              transition: 'transform 0.15s ease',
            }}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            onMouseEnter={(e) => {
              if (interactive) e.currentTarget.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              if (interactive) e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
