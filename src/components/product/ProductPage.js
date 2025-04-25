// src/components/product/ProductPage.js - Updated with API Integration
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Minus, Plus, Heart, Share2 } from "lucide-react";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";
import { toast } from "react-hot-toast";
import {
  productService,
  cartService,
  wishlistService,
  authService,
} from "../../services/api";

const ProductPage = () => {
  const { productId, categoryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts or when productId changes
    window.scrollTo(0, 0);

    // Reset state when product changes
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);

    // Fetch product details
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Get product details
        const productData = await productService.getProduct(productId);
        setProduct(productData);

        // Set initial color and size if available
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }

        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }

        // Check if product is in user's wishlist (if user is logged in)
        if (authService.isAuthenticated()) {
          try {
            const wishlistData = await wishlistService.getWishlist();
            if (wishlistData && wishlistData.items) {
              setIsWishlisted(
                wishlistData.items.some((item) => item.id === productId)
              );
            }
          } catch (error) {
            console.error("Error checking wishlist status:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    // Check if user is logged in
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in to add items to your cart");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    try {
      setAddingToCart(true);

      // Add to cart
      await cartService.addToCart({
        productId: product._id,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor.name || selectedColor,
      });

      toast.success(`${product.name} added to your cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    // Check if user is logged in
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in to add items to your wishlist");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    try {
      setAddingToWishlist(true);

      if (isWishlisted) {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(product._id);
        toast.success(`${product.name} removed from your wishlist!`);
      } else {
        // Add to wishlist
        await wishlistService.addToWishlist(product._id);
        toast.success(`${product.name} added to your wishlist!`);
      }

      // Toggle local state
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Failed to update wishlist. Please try again.");
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleShare = () => {
    // If Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    // Check if user is logged in
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in to proceed to checkout");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    // First add to cart, then navigate to checkout
    handleAddToCart().then(() => {
      navigate("/checkout");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  // Generate correct breadcrumb paths based on current URL structure
  const breadcrumbs = [
    { name: "Home", path: "/" },
    {
      name: categoryName || product.category,
      path: `/category/${categoryName || product.category}`,
    },
  ];

  // Add subcategory if available
  if (product.subcategory) {
    breadcrumbs.push({
      name: product.subcategory,
      path: `/category/${categoryName || product.category}/${
        product.subcategory
      }`,
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb Navigation - Dynamic */}
        <div className="flex items-center text-sm mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight size={14} className="mx-2 text-gray-400" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium">{crumb.name}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-gray-500 hover:text-black"
                >
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Product Images */}
          <div className="w-full md:w-1/2">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Thumbnail Column */}
              <div className="flex sm:flex-col gap-2 order-2 sm:order-1">
                {(product.images || []).slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 sm:w-20 sm:h-20 border rounded cursor-pointer overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="sm:flex-1 order-1 sm:order-2 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={
                    product.imageSrc ||
                    (product.images && product.images.length > 0
                      ? product.images[0]
                      : "/api/placeholder/500/500")
                  }
                  alt={product.name}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <h1 className="font-plak text-3xl font-bold mb-2">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.reviewCount || product.rating}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.discountPercentage && (
                <span className="ml-2 bg-red-100 text-red-500 px-2 py-1 text-xs font-bold rounded">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Product Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Select Color</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id || color.name}
                      className={`w-8 h-8 rounded-full ${
                        selectedColor &&
                        (selectedColor.id === color.id ||
                          selectedColor.name === color.name)
                          ? "ring-2 ring-offset-2 ring-black"
                          : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-medium mb-2">Choose Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-full text-sm ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border rounded-full">
                <button
                  className="w-10 h-10 flex items-center justify-center"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  className="w-10 h-10 flex items-center justify-center"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex-1 flex gap-2">
                <button
                  className="flex-1 bg-black text-white py-3 px-6 rounded-full font-medium disabled:bg-gray-400"
                  onClick={handleAddToCart}
                  disabled={addingToCart || !product.inStock}
                >
                  {addingToCart ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
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
                    </>
                  ) : !product.inStock ? (
                    "Out of Stock"
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                <button
                  className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-full font-medium hidden sm:block disabled:bg-gray-400"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Buy Now
                </button>

                <button
                  className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                    isWishlisted
                      ? "bg-red-50 border-red-200"
                      : "border-gray-300"
                  } ${addingToWishlist ? "opacity-50" : ""}`}
                  onClick={toggleWishlist}
                  disabled={addingToWishlist}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  {addingToWishlist ? (
                    <svg
                      className="animate-spin h-4 w-4"
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
                  ) : (
                    <Heart
                      size={18}
                      className={
                        isWishlisted ? "text-red-500 fill-red-500" : ""
                      }
                    />
                  )}
                </button>

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300"
                  onClick={handleShare}
                  aria-label="Share product"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Buy Now button (mobile only) */}
            <div className="sm:hidden mb-8">
              <button
                className="w-full bg-gray-900 text-white py-3 rounded-full font-medium disabled:bg-gray-400"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>

            {/* Additional product information */}
            <div className="mb-8 text-sm text-gray-600 space-y-1 border-t border-gray-200 pt-4">
              <p>
                <span className="font-medium">SKU:</span> {product.sku}
              </p>
              <p>
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </p>
              {product.subcategory && (
                <p>
                  <span className="font-medium">Subcategory:</span>{" "}
                  {product.subcategory}
                </p>
              )}
              <p>
                <span className="font-medium">Material:</span>{" "}
                {product.material}
              </p>
              <p>
                <span className="font-medium">Availability:</span>{" "}
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
              {product.tags && product.tags.length > 0 && (
                <p className="flex items-center flex-wrap gap-1">
                  <span className="font-medium">Tags:</span>
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-2 py-1 text-xs rounded-full cursor-pointer hover:bg-gray-200"
                      onClick={() => navigate(`/tag/${tag}`)}
                    >
                      {tag}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                className={`py-4 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Product Details
              </button>
              <button
                className={`py-4 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Rating & Reviews
              </button>
              <button
                className={`py-4 font-medium text-sm ${
                  activeTab === "faqs"
                    ? "border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("faqs")}
              >
                FAQs
              </button>
            </div>
          </div>

          <div className="py-6">
            {activeTab === "details" && (
              <div>
                <h3 className="font-bold mb-2">Product Details</h3>
                <p className="text-gray-600">{product.description}</p>
                {product.material && (
                  <ul className="list-disc list-inside mt-4 text-gray-600">
                    <li>{product.material}</li>
                  </ul>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviews productId={productId} />
            )}

            {activeTab === "faqs" && (
              <div>
                <h3 className="font-bold mb-2">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">
                      Is this product true to size?
                    </h4>
                    <p className="text-gray-600">
                      Yes, this product runs true to size. We recommend ordering
                      your regular size.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">
                      How do I care for this product?
                    </h4>
                    <p className="text-gray-600">
                      We recommend following the care instructions on the
                      product label. Generally, machine wash cold with like
                      colors and tumble dry low.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">
                      Is this product available in other colors?
                    </h4>
                    <p className="text-gray-600">
                      Yes, this product is available in multiple colors. Please
                      check the color selection above.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts
          productId={productId}
          categoryName={product.category}
        />
      </div>
    </div>
  );
};

export default ProductPage;
