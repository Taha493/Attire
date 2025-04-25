// src/components/BrowseByStyle/CategoryCard.js
import React from "react";

function CategoryCard({ title, imageSrc, productCount }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="flex h-48">
        <div className="p-4 pl-6 flex flex-col justify-center w-2/3">
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          {productCount && (
            <p className="text-sm text-gray-500">{productCount} products</p>
          )}
          <div className="mt-3">
            <span className="text-sm font-medium inline-flex items-center">
              Shop Now
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="w-1/2 overflow-hidden">
          <img
            src={imageSrc}
            alt={`${title} style clothing`}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
