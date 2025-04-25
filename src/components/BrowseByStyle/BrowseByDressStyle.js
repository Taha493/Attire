// src/components/BrowseByStyle/BrowseByDressStyle.js - Updated with API Integration
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { categoryService } from "../../services/api";

function BrowseByDressStyle() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get all categories
        const allCategories = await categoryService.getCategories();

        // Filter only dress style categories
        const dressStyleCategories = allCategories.filter(
          (category) => category.type === "dress-style"
        );

        setCategories(dressStyleCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewAllCategories = () => {
    navigate("/categories");
  };

  // Handle direct category navigation
  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-6 rounded-2xl w-full max-w-4xl mx-auto flex justify-center items-center h-48">
        <div className="loader animate-spin rounded-full border-t-2 border-b-2 border-black h-8 w-8"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-6 rounded-2xl w-full max-w-4xl mx-auto">
        <div className="text-center text-red-500 py-12">{error}</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-gray-100 p-6 rounded-2xl w-full max-w-4xl mx-auto">
        <div className="text-center text-gray-500 py-12">
          No dress style categories available.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-2xl w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-plak text-3xl font-black">BROWSE BY DRESS STYLE</h1>
        <button
          onClick={handleViewAllCategories}
          className="text-sm hover:underline hidden sm:block"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category.name)}
          >
            <CategoryCard
              title={category.name}
              imageSrc={category.imageSrc}
              productCount={category.productCount}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 text-center sm:hidden">
        <button
          onClick={handleViewAllCategories}
          className="border border-gray-300 text-sm py-2 px-4 rounded hover:bg-gray-50 transition-colors"
        >
          View All Categories
        </button>
      </div>
    </div>
  );
}

export default BrowseByDressStyle;
