import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "./ReviewCard";
import { ReviewClient } from "../../services/api"; // Correct import path

function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // Default to desktop view

  // Update visible review count based on window size
  const updateVisibleCount = () => {
    if (window.innerWidth < 640) {
      setVisibleCount(1); // Mobile
    } else if (window.innerWidth < 1024) {
      setVisibleCount(2); // Tablet
    } else {
      setVisibleCount(3); // Desktop
    }
  };

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ReviewClient.getReviews({ limit: 10 }); // Include limit parameter
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(
          err.message || "Failed to load reviews. Please try again later."
        );
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle window resize for responsive review count
  useEffect(() => {
    updateVisibleCount(); // Set initial count
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex + 1 >= reviews.length ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  // Function to get the visible reviews based on screen size
  const getVisibleReviews = () => {
    if (reviews.length === 0) return [];
    let result = [];
    for (let i = 0; i < visibleCount + 2; i++) {
      const idx = (activeIndex + i - 1 + reviews.length) % reviews.length;
      result.push(reviews[idx]);
    }
    return result.slice(0, visibleCount + 1); // +1 for the blurred card
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
        <h1 className="font-plak text-2xl sm:text-3xl font-black tracking-tighter text-center sm:text-left mb-4 sm:mb-0 sm:ml-4 md:ml-10">
          OUR HAPPY CUSTOMERS
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Previous reviews"
            disabled={isLoading || reviews.length === 0}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Next reviews"
            disabled={isLoading || reviews.length === 0}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Review carousel - adapts to screen size */}
      <div className="relative">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="loader animate-spin rounded-full border-t-2 border-b-2 border-black h-8 w-8"></div>
          </div>
        )}
        {error && <div className="text-center text-red-500 py-12">{error}</div>}
        {!isLoading && !error && reviews.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No reviews available at the moment.
          </div>
        )}
        {!isLoading && !error && reviews.length > 0 && (
          <>
            <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-hidden px-2">
              {getVisibleReviews().map((review, index) => {
                const isActive = reviews[activeIndex].id === review.id;
                const shouldBlur = index === getVisibleReviews().length - 2;

                return (
                  <div
                    key={review.id}
                    className={`transition-all duration-300 w-full ${
                      visibleCount === 1
                        ? "sm:w-full"
                        : visibleCount === 2
                        ? "sm:w-1/2"
                        : "sm:w-1/2 md:w-1/3"
                    } flex-shrink-0 ${
                      isActive ? "opacity-100 scale-100" : "opacity-90 scale-95"
                    }`}
                  >
                    <ReviewCard review={review} isBlurred={shouldBlur} />
                  </div>
                );
              })}
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    activeIndex === index ? "bg-black" : "bg-gray-300"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CustomerReviews;
