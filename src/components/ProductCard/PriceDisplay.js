import React from "react";

const PriceDisplay = ({ currentPrice, originalPrice, discountPercentage }) => {
  const hasDiscount = originalPrice && originalPrice > currentPrice;

  return (
    <div className="flex flex-wrap items-center text-xs sm:text-sm">
      <span className="font-antebas font-bold text-black">${currentPrice}</span>
      {hasDiscount && (
        <>
          <span className="font-antebas text-gray-400 line-through ml-1 sm:ml-2">
            ${originalPrice}
          </span>
          {discountPercentage && (
            <span className="font-antebas bg-red-100 text-red-500 text-xs px-1 sm:px-2 py-0.5 rounded ml-1 sm:ml-2 whitespace-nowrap">
              -{discountPercentage}%
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default PriceDisplay;
