// src/components/homepage/FeaturedProducts.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import { productService } from "../../services/api";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      const params = { limit: 8 };

      if (activeTab === "featured") {
        // Get featured products
        params.featured = true;
        response = await productService.getProducts(params);
      } else if (activeTab === "bestsellers") {
        // Get best sellers
        response = await productService.getTopSelling({
          filter: "most-popular",
          limit: 8,
        });
      } else if (activeTab === "new-arrivals") {
        // Get new arrivals
        response = await productService.getNewArrivals({ limit: 8 });
      } else if (activeTab === "trending") {
        // Get trending products
        response = await productService.getTopSelling({
          filter: "trending",
          limit: 8,
        });
      }

      setProducts(response.products || response || []);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    if (activeTab === "new-arrivals") {
      navigate("/new-arrivals");
    } else if (activeTab === "trending" || activeTab === "bestsellers") {
      navigate(
        `/top-selling?filter=${
          activeTab === "trending" ? "trending" : "most-popular"
        }`
      );
    } else {
      navigate("/products");
    }
  };

  // For mobile slider
  const scrollLeft = () => {
    const container = document.getElementById("featuredProductsContainer");
    if (container) {
      container.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("featuredProductsContainer");
    if (container) {
      container.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="font-plak text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
            {activeTab === "featured" && "FEATURED COLLECTION"}
            {activeTab === "bestsellers" && "BESTSELLERS"}
            {activeTab === "new-arrivals" && "NEW ARRIVALS"}
            {activeTab === "trending" && "TRENDING NOW"}
          </h2>
          <div className="flex space-x-1 sm:space-x-4">
            <div className="hidden sm:flex space-x-2 border-r border-gray-300 pr-4 mr-2">
              <button
                className={`px-4 py-1 text-sm rounded-full ${
                  activeTab === "featured"
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("featured")}
              >
                Featured
              </button>
              <button
                className={`px-4 py-1 text-sm rounded-full ${
                  activeTab === "bestsellers"
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("bestsellers")}
              >
                Bestsellers
              </button>
              <button
                className={`px-4 py-1 text-sm rounded-full ${
                  activeTab === "new-arrivals"
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("new-arrivals")}
              >
                New Arrivals
              </button>
              <button
                className={`px-4 py-1 text-sm rounded-full ${
                  activeTab === "trending"
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("trending")}
              >
                Trending
              </button>
            </div>

            {/* Mobile tabs - simplified */}
            <div className="sm:hidden flex space-x-2 mb-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-2 py-1 bg-gray-100 rounded-md text-sm border-0"
              >
                <option value="featured">Featured</option>
                <option value="bestsellers">Bestsellers</option>
                <option value="new-arrivals">New Arrivals</option>
                <option value="trending">Trending</option>
              </select>
            </div>

            <button
              onClick={handleViewAll}
              className="text-sm hover:underline flex items-center"
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Mobile/Tablet Slider Layout */}
            <div className="md:hidden relative">
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>

              <div
                id="featuredProductsContainer"
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {products.map((product) => (
                  <div
                    key={product._id || product.id}
                    className="flex-shrink-0 w-[calc(100vw-96px)] sm:w-[260px] snap-start"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
