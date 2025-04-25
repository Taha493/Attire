// src/components/CustomerReviews.js
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "./ReviewCard";

function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(1);

  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      verified: true,
      rating: 3,
      text: "I'm blown away by the quality and style of the clothes I received from Attire. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
      id: 2,
      name: "Alex K.",
      verified: true,
      rating: 5,
      text: "Finding clothes that align with my personal style used to be a challenge until I discovered Attire. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    },
    {
      id: 3,
      name: "James L.",
      verified: true,
      rating: 5,
      text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Attire. The selection of clothes is not only diverse but also on-point with the latest trends.",
    },
    {
      id: 4,
      name: "Emma P.",
      verified: true,
      rating: 4,
      text: "The customer service at Attire is exceptional. When I had an issue with sizing, their team was quick to respond and resolve my concern. Definitely my go-to for all fashion needs now.",
    },
    {
      id: 5,
      name: "Michael T.",
      verified: true,
      rating: 5,
      text: "Attire has transformed my wardrobe! The quality of the materials is top-notch, and the styles are perfect for both work and casual outings. Will definitely be a repeat customer.",
    },
    {
      id: 6,
      name: "Sophia R.",
      verified: true,
      rating: 4,
      text: "I appreciate the inclusive size range that Attire offers. It's refreshing to find a brand that caters to all body types without compromising on style or quality.",
    },
    {
      id: 7,
      name: "David W.",
      verified: true,
      rating: 5,
      text: "The fast shipping and careful packaging of my orders always impress me. Attire clearly values their customers and delivers a premium shopping experience from start to finish.",
    },
  ];

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
    let result = [];
    // On mobile and small screens, only show 1 review
    const visibleCount =
      window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;

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
          OUR&nbsp;&nbsp;HAPPY&nbsp;&nbsp;CUSTOMERS
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Previous reviews"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Next reviews"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Review carousel - adapts to screen size */}
      <div className="relative">
        <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-hidden px-2">
          {reviews.map((review, index) => {
            const isActive = index === activeIndex;
            const isVisible =
              (index >= activeIndex && index < activeIndex + 3) ||
              (activeIndex + 3 > reviews.length &&
                index < (activeIndex + 3) % reviews.length);
            const shouldBlur =
              isVisible && index === (activeIndex + 2) % reviews.length;

            // Only render visible cards for performance
            if (!isVisible) return null;

            return (
              <div
                key={review.id}
                className={`transition-all duration-300 w-full sm:w-1/2 md:w-1/3 flex-shrink-0 ${
                  isActive ? "opacity-100 scale-100" : "opacity-90 scale-95"
                }`}
              >
                <ReviewCard review={review} isBlurred={shouldBlur} />
              </div>
            );
          })}
        </div>

        {/* Optional: Add indicators */}
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
      </div>
    </div>
  );
}

export default CustomerReviews;
