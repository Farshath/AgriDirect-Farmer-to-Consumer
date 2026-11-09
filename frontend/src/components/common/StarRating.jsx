import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  rating = 5,
  maxRating = 5,
  size = 'sm',
  interactive = false,
  onChange,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-[#E5B64B] text-[#E5B64B]'
                  : 'text-[#DDE2BE] fill-[#F7F8EF]'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

