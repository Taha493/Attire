// src/components/ProductCard/ProductCard.js - Updated for API Integration
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import PriceDisplay from "./PriceDisplay";
import { toast } from "react-hot-toast";
// import { cartService, wishlistService, authService } from "../../services/api";

const ProductCard = ({ product }) => {
  // Check if product exists and has required fields
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  if (!product || !product.name) {
    return null; // Don't render if product is invalid
  }

  const {
    _id,
    name,
    imageSrc,
    images,
    rating,
    reviewCount,
    price,
    originalPrice,
    discountPercentage,
    category,
    inStock = true,
  } = product;

  // Function to handle product click with dynamic routing
  const handleProductClick = () => {
    // Navigate to product page with category included in URL path for better SEO and navigation
    navigate(`/category/${category}/product/${_id}`);
  };

  // Function to handle quick add to cart
  const handleQuickAdd = async (e) => {
    e.stopPropagation(); // Prevent navigating to product page

    // Check if user is logged in
    // if (!authService.isAuthenticated()) {
    //   toast.error("Please sign in to add items to your cart");
    //   navigate("/login", { state: { from: window.location.pathname } });
    //   return;
    // }

    if (!inStock) {
      toast.error("This item is currently out of stock");
      return;
    }

    try {
      // setIsAddingToCart(true);

      // // Add item to cart with default size and color if available
      // await cartService.addToCart({
      //   productId: _id,
      //   quantity: 1,
      //   size:
      //     product.sizes && product.sizes.length > 0
      //       ? product.sizes[0]
      //       : "Medium",
      //   color:
      //     product.colors && product.colors.length > 0
      //       ? product.colors[0].name
      //       : "Default",
      // });

      toast.success(`${name} added to your cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Function to handle category click
  const handleCategoryClick = (e) => {
    e.stopPropagation(); // Prevent navigating to product page
    navigate(`/category/${category}`);
  };

  // Get the main image to display
  const displayImage =
    imageSrc ||
    (images && images.length > 0 ? images[0] : "/api/placeholder/240/320");

  return (
    <div
      className="flex flex-col group cursor-pointer transition-all duration-300 hover:shadow-md rounded-lg"
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-[#f0eeed]-100 rounded-lg p-2 sm:p-3 md:p-4 mb-2 overflow-hidden relative">
        <div className="relative overflow-hidden">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Quick add button that appears on hover */}
          <div
            className={`font-antebas absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white text-xs sm:text-sm py-2 text-center transition-transform duration-300 ${
              isHovered ? "translate-y-0" : "translate-y-full"
            }`}
            onClick={handleQuickAdd}
          >
            {isAddingToCart ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-4 w-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </span>
            ) : (
              "Quick Add"
            )}
          </div>

          {/* Category tag */}
          {category && (
            <div
              className="absolute top-2 left-2 bg-white bg-opacity-90 text-xs px-2 py-1 rounded cursor-pointer hover:bg-black hover:text-white transition-colors"
              onClick={handleCategoryClick}
            >
              {category}
            </div>
          )}

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium px-3 py-1 bg-red-500 rounded-full text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-antebas font-medium text-xs ml-4 sm:text-sm line-clamp-2">
        {name}
      </h3>

      <div className="ml-4 mt-1">
        <StarRating rating={rating} reviewCount={rating} />
      </div>

      <div className="ml-4 mt-1">
        <PriceDisplay
          currentPrice={price}
          originalPrice={originalPrice}
          discountPercentage={discountPercentage}
        />
      </div>
    </div>
  );
};

export default ProductCard;
