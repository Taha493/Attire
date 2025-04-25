// src/components/category/PriceRangeSlider.js
import React, { useState, useEffect, useRef } from "react";

const PriceRangeSlider = ({
  minPrice = 50,
  maxPrice = 200,
  initialRange = [50, 200],
  onChange,
}) => {
  const [range, setRange] = useState(initialRange);
  const rangeTrackRef = useRef(null);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);
  const isDraggingMin = useRef(false);
  const isDraggingMax = useRef(false);

  // Update parent component when range changes
  useEffect(() => {
    if (onChange) {
      onChange(range);
    }
  }, [range, onChange]);

  // Calculate percentage for slider position
  const getLeftPosition = () => {
    return ((range[0] - minPrice) / (maxPrice - minPrice)) * 100;
  };

  const getRightPosition = () => {
    return 100 - ((range[1] - minPrice) / (maxPrice - minPrice)) * 100;
  };

  // Handle numeric input changes
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (!isNaN(newMin) && newMin <= range[1]) {
      setRange([Math.max(minPrice, newMin), range[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (!isNaN(newMax) && newMax >= range[0]) {
      setRange([range[0], Math.min(maxPrice, newMax)]);
    }
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e, isMin) => {
    e.preventDefault();
    if (isMin) {
      isDraggingMin.current = true;
    } else {
      isDraggingMax.current = true;
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingMin.current && !isDraggingMax.current) return;

    const trackRect = rangeTrackRef.current.getBoundingClientRect();
    const trackWidth = trackRect.width;

    // Get clientX from either mouse or touch event
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    // Calculate relative position (0 to 1)
    let relativePos = (clientX - trackRect.left) / trackWidth;

    // Clamp the position between 0 and 1
    relativePos = Math.max(0, Math.min(1, relativePos));

    // Convert to price value
    const priceValue = Math.round(
      minPrice + relativePos * (maxPrice - minPrice)
    );

    if (isDraggingMin.current) {
      // Ensure min doesn't exceed max
      const newMin = Math.min(priceValue, range[1] - 1);
      setRange([newMin, range[1]]);
    } else if (isDraggingMax.current) {
      // Ensure max doesn't go below min
      const newMax = Math.max(priceValue, range[0] + 1);
      setRange([range[0], newMax]);
    }
  };

  const handleMouseUp = () => {
    isDraggingMin.current = false;
    isDraggingMax.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("touchend", handleMouseUp);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e, isMin) => {
    e.preventDefault();
    handleMouseDown(e, isMin);
  };

  return (
    <div className="mt-3">
      <div
        className="relative h-1 bg-gray-200 rounded-full"
        ref={rangeTrackRef}
      >
        {/* Range bar */}
        <div
          className="absolute h-full bg-black rounded-full"
          style={{
            left: `${getLeftPosition()}%`,
            right: `${getRightPosition()}%`,
          }}
        ></div>

        {/* Min handle */}
        <div
          ref={minThumbRef}
          className="absolute w-4 h-4 bg-black rounded-full -mt-1.5 -ml-2 cursor-pointer touch-none"
          style={{ left: `${getLeftPosition()}%` }}
          onMouseDown={(e) => handleMouseDown(e, true)}
          onTouchStart={(e) => handleTouchStart(e, true)}
          tabIndex={0}
          role="slider"
          aria-valuemin={minPrice}
          aria-valuemax={range[1]}
          aria-valuenow={range[0]}
        ></div>

        {/* Max handle */}
        <div
          ref={maxThumbRef}
          className="absolute w-4 h-4 bg-black rounded-full -mt-1.5 -ml-2 cursor-pointer touch-none"
          style={{ left: `${100 - getRightPosition()}%` }}
          onMouseDown={(e) => handleMouseDown(e, false)}
          onTouchStart={(e) => handleTouchStart(e, false)}
          tabIndex={0}
          role="slider"
          aria-valuemin={range[0]}
          aria-valuemax={maxPrice}
          aria-valuenow={range[1]}
        ></div>
      </div>

      {/* Price display and inputs */}
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <div className="relative">
          <span className="absolute -top-6">$</span>
          <input
            type="number"
            min={minPrice}
            max={range[1] - 1}
            value={range[0]}
            onChange={handleMinChange}
            className="w-12 border-none focus:outline-none bg-transparent"
            aria-label="Minimum price"
          />
        </div>
        <div className="relative">
          <span className="absolute -top-6">$</span>
          <input
            type="number"
            min={range[0] + 1}
            max={maxPrice}
            value={range[1]}
            onChange={handleMaxChange}
            className="w-12 border-none focus:outline-none bg-transparent text-right"
            aria-label="Maximum price"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
