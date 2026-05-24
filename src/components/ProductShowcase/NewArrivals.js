import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Filter, X } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import PriceRangeSlider from "../category/PriceRangeSlider";
import ColorFilters from "../category/ColorFilter";
import SizeFilters from "../category/SizeFilter";
import CategoryFilters from "../category/CategoryFilter";
import { productService } from "../../services/api";
import { toast } from "react-hot-toast";

const NewArrivals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([1, 1000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    colors: true,
    size: true,
    dressStyle: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const pageTopRef = useRef(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const limit = isDashboard ? 4 : 20;
        const newArrivalsData = await productService.getNewArrivals({ limit });
        // Ensure the response is an array
        const productsArray = Array.isArray(newArrivalsData)
          ? newArrivalsData
          : [];
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setError("Failed to load new arrivals");
        setProducts([]);
        setFilteredProducts([]);
        toast.error("Failed to load new arrivals");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
    if (pageTopRef.current && !isDashboard) {
      pageTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isDashboard]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Skip filtering for dashboard to show all fetched products
    if (isDashboard) {
      setFilteredProducts(filtered.slice(0, 4));
      return;
    }

    // Filter by price range
    // filtered = filtered.filter(
    //   (product) =>
    //     product.currentPrice >= priceRange[0] &&
    //     product.currentPrice <= priceRange[1]
    // );

    // // Filter by colors
    // if (selectedColors.length > 0) {
    //   filtered = filtered.filter((product) =>
    //     selectedColors.includes(product.color?.toLowerCase())
    //   );
    // }

    // // Filter by sizes
    // if (selectedSizes.length > 0) {
    //   filtered = filtered.filter((product) =>
    //     product.sizes?.some((size) =>
    //       selectedSizes.includes(size.toLowerCase())
    //     )
    //   );
    // }

    // // Filter by category
    // if (currentCategory !== "All") {
    //   filtered = filtered.filter(
    //     (product) =>
    //       product.category?.toLowerCase() === currentCategory.toLowerCase()
    //   );
    // }

    // // Apply sorting
    // switch (sortBy) {
    //   case "Newest":
    //     filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    //     break;
    //   case "Price: Low to High":
    //     filtered.sort((a, b) => a.currentPrice - b.currentPrice);
    //     break;
    //   case "Price: High to Low":
    //     filtered.sort((a, b) => b.currentPrice - a.currentPrice);
    //     break;
    //   default:
    //     // Most Popular (default)
    //     filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    //     break;
    // }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    products,
    priceRange,
    selectedColors,
    selectedSizes,
    currentCategory,
    sortBy,
    isDashboard,
  ]);

  const handleViewAll = () => {
    navigate("/products/new-arrivals");
  };

  const toggleFilter = (filter) => {
    setExpandedFilters({
      ...expandedFilters,
      [filter]: !expandedFilters[filter],
    });
  };

  const toggleMobileFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCategoryChange = (newCategory) => {
    setCurrentCategory(newCategory);
  };

  // Pagination
  const productsPerPage = 6;
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = isDashboard
    ? filteredProducts.slice(0, 4)
    : filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      );

  // Calculate the start and end indices for products being displayed
  const startIndex =
    filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const endIndex = Math.min(
    currentPage * productsPerPage,
    filteredProducts.length
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
      if (pageTopRef.current) {
        pageTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (loading) {
    return (
      <section className="py-6 sm:py-8 md:py-10">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          NEW ARRIVALS
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6 sm:py-8 md:py-10">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          NEW ARRIVALS
        </h2>
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  if (isDashboard) {
    return (
      <section className="py-6 sm:py-8 md:py-10">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          NEW ARRIVALS
        </h2>
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500">
            No new products available at this time.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        {location.pathname !== "/products/new-arrivals" && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              className="border border-gray-300 text-sm py-2 px-6 sm:px-8 rounded hover:bg-gray-50 transition-colors"
              onClick={handleViewAll}
            >
              View All
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-white" ref={pageTopRef}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-6">
          <a href="/" className="text-gray-500 hover:text-black">
            Home
          </a>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">New Arrivals</span>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle Button */}
          <button
            className="md:hidden flex items-center justify-center w-full py-3 px-4 mb-4 border border-gray-300 rounded-full font-medium text-sm"
            onClick={toggleMobileFilters}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-white p-4 overflow-y-auto md:hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-plak text-xl font-bold">Filters</h2>
                <button
                  onClick={toggleMobileFilters}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <FilterHeader
                  label="Price"
                  isExpanded={expandedFilters.price}
                  onToggle={() => toggleFilter("price")}
                />
                {expandedFilters.price && (
                  <PriceRangeSlider
                    initialRange={priceRange}
                    onChange={setPriceRange}
                  />
                )}
              </div>

              {/* Colors Filter */}
              <div className="mb-6">
                <FilterHeader
                  label="Colors"
                  isExpanded={expandedFilters.colors}
                  onToggle={() => toggleFilter("colors")}
                />
                {expandedFilters.colors && (
                  <ColorFilters
                    selectedColors={selectedColors}
                    onChange={setSelectedColors}
                  />
                )}
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <FilterHeader
                  label="Size"
                  isExpanded={expandedFilters.size}
                  onToggle={() => toggleFilter("size")}
                />
                {expandedFilters.size && (
                  <SizeFilters
                    selectedSizes={selectedSizes}
                    onChange={setSelectedSizes}
                  />
                )}
              </div>

              {/* Dress Style Filter */}
              <div className="mb-6">
                <FilterHeader
                  label="Dress Style"
                  isExpanded={expandedFilters.dressStyle}
                  onToggle={() => toggleFilter("dressStyle")}
                />
                {expandedFilters.dressStyle && (
                  <CategoryFilters
                    currentCategory={currentCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                )}
              </div>

              {/* Apply Filter Button */}
              <div className="sticky bottom-0 pt-4 pb-6 bg-white">
                <button
                  className="w-full py-3 bg-black text-white rounded-full font-medium"
                  onClick={toggleMobileFilters}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}

          {/* Desktop Filters Section */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <button className="text-gray-400">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    d="M4 6h16M4 12h16m-7 6h7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <FilterHeader
                label="Price"
                isExpanded={expandedFilters.price}
                onToggle={() => toggleFilter("price")}
              />
              {expandedFilters.price && (
                <PriceRangeSlider
                  initialRange={priceRange}
                  onChange={setPriceRange}
                />
              )}
            </div>

            {/* Colors Filter */}
            <div className="mb-6">
              <FilterHeader
                label="Colors"
                isExpanded={expandedFilters.colors}
                onToggle={() => toggleFilter("colors")}
              />
              {expandedFilters.colors && (
                <ColorFilters
                  selectedColors={selectedColors}
                  onChange={setSelectedColors}
                />
              )}
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <FilterHeader
                label="Size"
                isExpanded={expandedFilters.size}
                onToggle={() => toggleFilter("size")}
              />
              {expandedFilters.size && (
                <SizeFilters
                  selectedSizes={selectedSizes}
                  onChange={setSelectedSizes}
                />
              )}
            </div>

            {/* Dress Style Filter */}
            <div className="mb-6">
              <FilterHeader
                label="Dress Style"
                isExpanded={expandedFilters.dressStyle}
                onToggle={() => toggleFilter("dressStyle")}
              />
              {expandedFilters.dressStyle && (
                <CategoryFilters
                  currentCategory={currentCategory}
                  onCategoryChange={handleCategoryChange}
                />
              )}
            </div>

            {/* Apply Filter Button */}
            <button className="w-full py-3 bg-black text-white rounded-full font-medium">
              Apply Filter
            </button>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold mb-2 sm:mb-0">New Arrivals</h1>
              <div className="flex items-center text-sm">
                <span className="text-gray-500">
                  Showing {filteredProducts.length > 0 ? startIndex : 0}-
                  {endIndex} of {filteredProducts.length} Products
                </span>
                <div className="ml-4 flex items-center">
                  <span className="mr-2">Sort by:</span>
                  <div className="relative group">
                    <button className="flex items-center font-medium">
                      {sortBy}
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setSortBy("Most Popular")}
                        >
                          Most Popular
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setSortBy("Newest")}
                        >
                          Newest
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setSortBy("Price: Low to High")}
                        >
                          Price: Low to High
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setSortBy("Price: High to Low")}
                        >
                          Price: High to Low
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pageCount > 0 && (
              <div className="flex justify-between items-center mt-10">
                <button
                  className="flex items-center text-sm font-medium"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg
                    className="mr-1 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => (
                    <button
                      key={i}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === i + 1
                          ? "bg-black text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  {pageCount > 7 && (
                    <>
                      <span className="w-8 h-8 flex items-center justify-center">
                        ...
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                        onClick={() => handlePageChange(pageCount)}
                      >
                        {pageCount}
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="flex items-center text-sm font-medium"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pageCount}
                >
                  Next
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
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components for Filters
const FilterHeader = ({ label, isExpanded, onToggle }) => (
  <div
    className="flex justify-between items-center cursor-pointer"
    onClick={onToggle}
  >
    <h3 className="font-medium">{label}</h3>
    {isExpanded ? (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    )}
  </div>
);

export default NewArrivals;
