import React from "react";
import NewArrivals from "./NewArrivals";
import TopSelling from "./TopSelling";

const ProductShowcase = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
      <NewArrivals />
      <div className="my-4 sm:my-6 md:my-8 border-t border-gray-200"></div>
      <TopSelling />
    </div>
  );
};

export default ProductShowcase;
