import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { categoryService } from "../../services/api";

const AllCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({
    dressStyles: [],
    genderCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    let isMounted = true;

    const fetchAllCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        try {
          response = await categoryService.getCategories();
        } catch (apiError) {
          console.warn("API call failed, using mock data:", apiError);
        }

        if (isMounted) {
          if (Array.isArray(response)) {
            const dressStyles = [];
            const genderCategories = [];

            response.forEach((item) => {
              if (item?.type === "dress-style") {
                dressStyles.push(item);
              } else if (item?.type === "gender") {
                genderCategories.push(item);
              }
            });

            setCategories({ dressStyles, genderCategories });
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Final error:", err);
          setError("Failed to load categories. Please try again later.");
          setCategories({ dressStyles: [], genderCategories: [] });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllCategories();

    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  const handleCategoryClick = (path) => {
    if (path) navigate(path);
  };

  const renderCategoryCard = (category) => (
    <div
      key={category.id}
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md"
      onClick={() => handleCategoryClick("/category/" + category.name)}
    >
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={category.imageSrc || "/api/placeholder/400/320"}
          alt={category.title || "Category"}
          className="object-cover w-full h-48"
          onError={(e) => {
            e.target.src = "/api/placeholder/400/320";
            e.target.alt = "Image not available";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h3 className="text-white text-xl font-bold">{category.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            {category.productCount || 0} products
          </span>
          <button
            className="text-sm font-medium flex items-center"
            aria-label={`Shop ${category.name}`}
          >
            Shop Now <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">All Categories</span>
        </div>

        <h1 className="text-4xl font-bold mb-8">Shop By Category</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Dress Styles</h2>
              {categories.dressStyles.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  No dress style categories found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categories.dressStyles.map(renderCategoryCard)}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Shop By Gender</h2>
              {categories.genderCategories.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  No gender categories found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categories.genderCategories.map(renderCategoryCard)}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCategoriesPage;
