// src/components/ReviewCard.js
import React from "react";

function ReviewCard({ review, isBlurred }) {
  // Render stars based on actual rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <span
              key={index}
              className={`text-xl sm:text-2xl ${
                index < rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
      </div>
    );
  };

  return (
    <div
      className={`flex-1 min-w-full sm:min-w-60 p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm h-full ${
        isBlurred ? "blur-sm" : ""
      }`}
    >
      <div className="mb-2">{renderStars(review.rating)}</div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold text-base sm:text-lg">{review.name}</h3>
        {review.verified && (
          <span className="text-green-500 flex items-center text-xs sm:text-sm">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="currentColor"
              />
              <path
                d="M8 12L10.5 14.5L16 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
      <p className="text-gray-600 text-xs sm:text-sm line-clamp-4 sm:line-clamp-none">
        {review.text}
      </p>
    </div>
  );
}

export default ReviewCard;
