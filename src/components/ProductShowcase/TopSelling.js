// src/components/ProductShowcase/TopSelling.js - Updated with API Integration
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
// import { productService } from "../../services/api";
import { toast } from "react-hot-toast";

const TopSelling = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // In src/components/ProductShowcase/TopSelling.js
  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        // Use the productService
        // const topSellingData = await productService.getTopSelling({ limit: 4 });
        // setProducts(topSellingData);
      } catch (error) {
        console.error("Error fetching top selling products:", error);
        // Set empty array as fallback
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSelling();
  }, []);

  const handleViewAll = () => {
    // Navigate to a dedicated top selling page
    navigate("/top-selling");
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-6 sm:py-8 md:py-10">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          TOP SELLING
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-6 sm:py-8 md:py-10">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          TOP SELLING
        </h2>
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  // If no products found
  if (products.length === 0) {
    return (
      <section className="py-6 sm:py-8 md:py-10">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          TOP SELLING
        </h2>
        <div className="text-center text-gray-500">
          No top selling products available at this time.
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8 md:py-10">
      <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        TOP SELLING
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="flex justify-center mt-6 sm:mt-8">
        <button
          className="border border-gray-300 text-sm py-2 px-6 sm:px-8 rounded hover:bg-gray-50 transition-colors"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>
    </section>
  );
};

export default TopSelling;
