// src/components/homepage/CategoryGrid.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoryService } from "../../services/api";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await categoryService.getCategories();

        // Filter categories - for homepage we want main gender categories
        const genderCategories = response.filter(
          (cat) =>
            cat.type === "gender" || ["Men", "Women", "Kids"].includes(cat.name)
        );

        // Sort categories to ensure Men, Women, Kids order
        const sortOrder = { Men: 1, Women: 2, Kids: 3 };
        genderCategories.sort((a, b) => {
          return (sortOrder[a.name] || 99) - (sortOrder[b.name] || 99);
        });

        setCategories(genderCategories.slice(0, 3)); // Limit to top 3
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories if API fails
        setCategories([
          {
            name: "Men",
            description: "Discover our collection for men",
            imageSrc: "/api/placeholder/600/600",
            productCount: 120,
          },
          {
            name: "Women",
            description: "Explore our women's collection",
            imageSrc: "/api/placeholder/600/600",
            productCount: 145,
          },
          {
            name: "Kids",
            description: "Stylish outfits for the little ones",
            imageSrc: "/api/placeholder/600/600",
            productCount: 78,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  if (loading) {
    return (
      <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-8 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold mb-8 text-center sm:text-left">
          SHOP BY CATEGORY
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative h-80 overflow-hidden rounded-xl cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105">
                <img
                  src={category.imageSrc}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition-opacity"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="font-bold text-2xl mb-1">{category.name}</h3>
                <p className="text-sm text-white/80 mb-3">
                  {category.description ||
                    `Shop our ${category.name.toLowerCase()}'s collection`}
                </p>

                <div className="flex items-center mt-2 text-sm font-medium">
                  <span>Shop Now</span>
                  <ArrowRight
                    size={16}
                    className="ml-2 transform group-hover:translate-x-1 transition-transform"
                  />
                </div>

                {/* Product count badge */}
                {category.productCount && (
                  <div className="absolute top-4 right-4 bg-white text-black text-xs font-medium px-2 py-1 rounded-full">
                    {category.productCount} products
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/categories")}
            className="border border-gray-300 bg-white text-black py-2 px-6 rounded-full hover:bg-gray-50 transition-colors"
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
