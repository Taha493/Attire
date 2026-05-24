import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { productService } from "../../services/api";
import ProductCard from "../ProductCard/ProductCard";

const RelatedProducts = ({ categoryName, productId }) => {
  const navigate = useNavigate();
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch 4 products from the specified category using productService
        const response = await productService.getProducts({
          category: categoryName,
          limit: 4,
        });

        // Ensure the response is an array
        let productsArray = Array.isArray(response.products)
          ? response.products
          : [];

        productsArray = productsArray.filter(
          (product) => product._id !== productId // Exclude the current product from the list
        );
        // Map backend response to match frontend expected format
        const formattedProducts = productsArray.map((product) => ({
          _id: product._id,
          name: product.name,
          imageSrc: product.imageSrc || "/api/placeholder/240/320", // Fallback image
          rating: product.rating || 4.0,
          reviewCount: product.reviewCount || 100,
          price: product.price,
          originalPrice: product.originalPrice || null,
          discountPercentage: product.discountPercentage || null,
          category: product.category || categoryName,
        }));

        setRelatedProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching related products:", error);
        setError("Failed to load related products");
        setRelatedProducts([]);
        toast.error("Failed to load related products");
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryName) {
      fetchRelatedProducts();
    }
  }, [categoryName, productId]); // Re-fetch when categoryName changes

  // Function to handle quick add
  const handleQuickAdd = (e, product) => {
    e.stopPropagation(); // Prevent navigating to product page

    // In a real app, you would dispatch an action to add the item to the cart
    toast.success(`Added ${product.name} to your cart!`, {
      position: "top-center",
      duration: 3000,
    });
  };

  // Function to handle product click (navigate to product page)
  const handleProductClick = (product) => {
    // Navigate to product page with category for better SEO and UX
    navigate(`/category/${product.category}/product/${product.id}`);
  };

  // Function to view more related products
  const handleViewMoreRelated = () => {
    navigate(`/category/${categoryName}`);
  };

  // Function to render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-gray-500">{rating}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-8">
          YOU MIGHT ALSO LIKE
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-8">
          YOU MIGHT ALSO LIKE
        </h2>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold">
          YOU MIGHT ALSO LIKE
        </h2>
        <button
          onClick={handleViewMoreRelated}
          className="text-sm hover:underline hidden sm:block"
        >
          View More
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map(
          (product) => (
            console.log(relatedProducts),
            (<ProductCard product={product} key={product._id} />)
            // <div
            //   key={product.id}
            //   className="group cursor-pointer relative"
            //   onClick={() => handleProductClick(product)}
            //   onMouseEnter={() => setHoveredProductId(product.id)}
            //   onMouseLeave={() => setHoveredProductId(null)}
            // >
            //   {/* Product Image with Quick Add overlay */}
            //   <div className="bg-gray-100 rounded-lg p-2 mb-2 overflow-hidden relative">
            //     <img
            //       src={product.imageSrc}
            //       alt={product.name}
            //       className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            //     />

            //     {/* Category Tag */}
            //     {product.category && (
            //       <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-xs px-2 py-0.5 rounded">
            //         {product.category}
            //       </div>
            //     )}

            //     {/* Quick Add Button (appears on hover) */}
            //     <div
            //       className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white text-xs sm:text-sm py-2 text-center transition-transform duration-300 ${
            //         hoveredProductId === product.id
            //           ? "translate-y-0"
            //           : "translate-y-full"
            //       }`}
            //       onClick={(e) => handleQuickAdd(e, product)}
            //     >
            //       Quick Add
            //     </div>
            //   </div>

            //   {/* Product Info */}
            //   <h3 className="font-medium text-xs sm:text-sm line-clamp-2">
            //     {product.name}
            //   </h3>

            //   <div className="mt-1">{renderStars(product.rating)}</div>

            //   <div className="mt-1 flex items-center text-xs sm:text-sm">
            //     <span className="font-bold">${product.currentPrice}</span>

            //     {product.originalPrice && (
            //       <span className="ml-2 text-gray-400 line-through">
            //         ${product.originalPrice}
            //       </span>
            //     )}

            //     {product.discountPercentage && (
            //       <span className="ml-2 bg-red-100 text-red-500 text-xs px-1 py-0.5 rounded">
            //         -{product.discountPercentage}%
            //       </span>
            //     )}
            //   </div>
            // </div>
          )
        )}
      </div>

      {/* Mobile View More button */}
      <div className="mt-6 text-center sm:hidden">
        <button
          onClick={handleViewMoreRelated}
          className="border border-gray-300 text-sm py-2 px-6 rounded hover:bg-gray-50 transition-colors"
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default RelatedProducts;
