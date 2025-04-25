import React from "react";

const StarRating = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        // Determine if this position needs a full, half, or empty star
        const fullStar = i < Math.floor(rating);
        const halfStar = !fullStar && i < Math.floor(rating + 0.5);

        return (
          <div key={i} className="relative">
            {/* Background star (gray) */}
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            {/* Foreground star (yellow) - either full or half */}
            {(fullStar || halfStar) && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: fullStar ? "100%" : "50%" }}
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
      <span className="text-xs text-gray-500 ml-1">{reviewCount}</span>
    </div>
  );
};

export default StarRating;
