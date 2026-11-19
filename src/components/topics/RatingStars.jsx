import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RATING_LABELS = {
  1: '1 - Novice (Just started / High confusion)',
  2: '2 - Basic (Know concepts, cannot code yet)',
  3: '3 - Intermediate (Can code with hints/docs)',
  4: '4 - Proficient (Can code independently)',
  5: '5 - Confident (Interview ready / Mastered)',
};

export default function RatingStars({
  rating = 1,
  onChange = null,
  size = 'h-4 w-4',
  showLabel = false,
  readOnly = false,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating || 1;

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayRating;
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly || !onChange}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => !readOnly && setHoverRating(star)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
              className={`${
                readOnly || !onChange ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              } transition-transform p-0.5 focus:outline-none`}
              title={RATING_LABELS[star]}
              aria-label={`Rate ${star} of 5`}
            >
              <Star
                className={`${size} ${
                  filled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                    : 'text-slate-600 fill-transparent hover:text-slate-400'
                } transition-colors`}
              />
            </button>
          );
        })}
        <span className="ml-1.5 text-xs font-mono font-semibold text-slate-300">
          {rating}/5
        </span>
      </div>

      {showLabel && (
        <span className="text-[11px] text-slate-400">
          {RATING_LABELS[displayRating] || RATING_LABELS[1]}
        </span>
      )}
    </div>
  );
}
