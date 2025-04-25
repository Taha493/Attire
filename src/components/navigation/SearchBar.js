import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Popular search suggestions
  const popularSearches = [
    "T-shirts",
    "Jeans",
    "Dresses",
    "Jackets",
    "Gym wear",
    "Casual",
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Close mobile search if open
      if (mobileSearchOpen) {
        setMobileSearchOpen(false);
      }

      // Navigate to search results page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);

      // Reset search input
      setSearchQuery("");
    }
  };

  const handlePopularSearch = (term) => {
    // Navigate to search results with the popular term
    navigate(`/search?q=${encodeURIComponent(term)}`);

    // Close mobile search if open
    if (mobileSearchOpen) {
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      {/* Desktop search bar - hidden on small screens */}
      <form
        onSubmit={handleSearch}
        className="hidden sm:flex relative bg-gray-100 rounded-full items-center px-2 sm:px-4 py-1 sm:py-2 w-32 md:w-48 lg:w-64"
      >
        <Search size={16} className="text-gray-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent ml-2 outline-none text-xs sm:text-sm w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* Mobile search button - visible only on small screens */}
      <button
        className="sm:hidden p-1.5 bg-gray-100 rounded-full"
        onClick={() => setMobileSearchOpen(true)}
        aria-label="Open search"
      >
        <Search size={16} className="text-gray-500" />
      </button>

      {/* Mobile search overlay - appears when search button is clicked */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4 sm:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-plak text-lg font-bold">Search</h2>
            <button
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close search"
              className="p-1"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative bg-gray-100 rounded-full flex items-center px-4 py-2">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search for products..."
                className="bg-transparent ml-2 outline-none text-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className="p-1"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={16} className="text-gray-500" />
                </button>
              )}
            </div>
          </form>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Popular searches:</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  className="bg-gray-100 text-sm px-3 py-1 rounded-full hover:bg-gray-200"
                  onClick={() => handlePopularSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Recent searches - would be populated from local storage or user history */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Recent searches:</h3>
            <div className="space-y-2">
              {["Black T-shirt", "Summer dress", "Formal shoes"].map((term) => (
                <div
                  key={term}
                  className="flex items-center justify-between py-2 border-b border-gray-100 cursor-pointer"
                  onClick={() => handlePopularSearch(term)}
                >
                  <div className="flex items-center">
                    <Search size={14} className="text-gray-400 mr-2" />
                    <span className="text-sm">{term}</span>
                  </div>
                  <X
                    size={14}
                    className="text-gray-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Remove from recent searches logic would go here
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
