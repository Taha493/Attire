// src/components/category/AllCategoriesPage.js
import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import CasualModel from "../../assests/mancasual.jpeg";
import FormalModel from "../../assests/formal.jpeg";
import Gym from "../../assests/gyn.jpeg";
import Party from "../../assests/party.jpeg";

const AllCategoriesPage = () => {
  // const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, fetch categories from an API
    const fetchAllCategories = async () => {
      setLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // This would be a real API call in production
        // const response = await fetch('/api/categories');
        // const data = await response.json();

        // Mock data for demonstration - Dress Styles
        const dressStylesData = [
          {
            id: "casual",
            title: "Casual",
            image: CasualModel,
            path: "/category/Casual",
            productCount: 47,
            type: "dress-style",
          },
          {
            id: "formal",
            title: "Formal",
            image: FormalModel,
            path: "/category/Formal",
            productCount: 34,
            type: "dress-style",
          },
          {
            id: "party",
            title: "Party",
            image: Party,
            path: "/category/Party",
            productCount: 26,
            type: "dress-style",
          },
          {
            id: "gym",
            title: "Gym",
            image: Gym,
            path: "/category/Gym",
            productCount: 18,
            type: "dress-style",
          },
        ];

        // Mock data for demonstration - Gender Categories
        const genderCategoriesData = [
          {
            id: "men",
            title: "Men",
            image: "/api/placeholder/320/240",
            path: "/category/Men",
            productCount: 120,
            type: "gender",
          },
          {
            id: "women",
            title: "Women",
            image: "/api/placeholder/320/240",
            path: "/category/Women",
            productCount: 145,
            type: "gender",
          },
          {
            id: "kids",
            title: "Kids",
            image: "/api/placeholder/320/240",
            path: "/category/Kids",
            productCount: 78,
            type: "gender",
          },
          {
            id: "unisex",
            title: "Unisex",
            image: "/api/placeholder/320/240",
            path: "/category/Unisex",
            productCount: 36,
            type: "gender",
          },
        ];

        // Mock data for demonstration - Product Type Categories
        const productTypeData = [
          {
            id: "t-shirts",
            title: "T-Shirts",
            image: "/api/placeholder/320/240",
            path: "/category/T-shirts",
            productCount: 85,
            type: "product-type",
          },
          {
            id: "shirts",
            title: "Shirts",
            image: "/api/placeholder/320/240",
            path: "/category/Shirts",
            productCount: 64,
            type: "product-type",
          },
          {
            id: "jeans",
            title: "Jeans",
            image: "/api/placeholder/320/240",
            path: "/category/Jeans",
            productCount: 43,
            type: "product-type",
          },
          {
            id: "jackets",
            title: "Jackets",
            image: "/api/placeholder/320/240",
            path: "/category/Jackets",
            productCount: 32,
            type: "product-type",
          },
          {
            id: "accessories",
            title: "Accessories",
            image: "/api/placeholder/320/240",
            path: "/category/Accessories",
            productCount: 54,
            type: "product-type",
          },
          {
            id: "shoes",
            title: "Shoes",
            image: "/api/placeholder/320/240",
            path: "/category/Shoes",
            productCount: 38,
            type: "product-type",
          },
        ];

        // Combine all category types
        setCategories({
          dressStyles: dressStylesData,
          genderCategories: genderCategoriesData,
          productTypes: productTypeData,
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  // Handle category click
  // const handleCategoryClick = (path) => {
  //   navigate(path);
  // };

  // Render category card
  const renderCategoryCard = (category) => (
    <div
      key={category.id}
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md"
      // onClick={() => handleCategoryClick(category.path)}
    >
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={category.image}
          alt={category.title}
          className="object-cover w-full h-48"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h3 className="text-white text-xl font-bold">{category.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            {category.productCount} products
          </span>
          <button className="text-sm font-medium flex items-center">
            Shop Now
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">All Categories</span>
        </div>

        {/* Page Title */}
        <h1 className="font-plak text-3xl font-bold mb-8">Shop By Category</h1>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Dress Styles Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Dress Styles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.dressStyles &&
                  categories.dressStyles.map((category) =>
                    renderCategoryCard(category)
                  )}
              </div>
            </section>

            {/* Gender Categories Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Shop By Gender</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.genderCategories &&
                  categories.genderCategories.map((category) =>
                    renderCategoryCard(category)
                  )}
              </div>
            </section>

            {/* Product Types Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Product Types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.productTypes &&
                  categories.productTypes.map((category) =>
                    renderCategoryCard(category)
                  )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCategoriesPage;
