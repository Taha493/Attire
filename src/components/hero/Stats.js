import React from "react";

const Stats = () => {
  return (
    <div className="flex flex-wrap justify-center md:justify-start mt-8 sm:mt-12 gap-4 sm:gap-6 md:gap-8">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold">200+</span>
        <span className="text-xs sm:text-sm text-gray-500">
          International Brands
        </span>
      </div>
      <div className="flex flex-col items-center md:items-start">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold">
          2,000+
        </span>
        <span className="text-xs sm:text-sm text-gray-500">
          High-Quality Products
        </span>
      </div>
      <div className="flex flex-col items-center md:items-start">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold">
          30,000+
        </span>
        <span className="text-xs sm:text-sm text-gray-500">
          Happy Customers
        </span>
      </div>
    </div>
  );
};

export default Stats;
