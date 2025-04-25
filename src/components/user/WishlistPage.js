// src/components/user/WishlistPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeartOff, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch wishlist items
    const fetchWishlist = async () => {
      setLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // This would be a real API call in production
        // const response = await fetch('/api/user/wishlist');
        // const data = await response.json();

        // Mock wishlist data
        const mockWishlistItems = [
          {
            id: "t-shirt-tape-details",
            name: "T-shirt with Tape Details",
            imageSrc: "/api/placeholder/240/320",
            price: 120,
            originalPrice: null,
            discountPercentage: null,
            rating: 4.5,
            reviewCount: "4.5/5",
            inStock: true,
            category: "Casual",
            dateAdded: "2025-03-15T10:30:00Z",
          },
          {
            id: "vertical-striped-shirt",
            name: "Vertical Striped Shirt",
            imageSrc: "/api/placeholder/240/320",
            price: 212,
            originalPrice: 232,
            discountPercentage: 9,
            rating: 5.0,
            reviewCount: "5.0/5",
            inStock: true,
            category: "Formal",
            dateAdded: "2025-03-20T14:20:00Z",
          },
          {
            id: "slim-fit-chinos",
            name: "Slim Fit Chinos",
            imageSrc: "/api/placeholder/240/320",
            price: 175,
            originalPrice: null,
            discountPercentage: null,
            rating: 4.6,
            reviewCount: "4.6/5",
            inStock: false,
            category: "Formal",
            dateAdded: "2025-04-01T09:45:00Z",
          },
        ];

        setWishlistItems(mockWishlistItems);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Handle removing an item from wishlist
  const handleRemoveFromWishlist = (itemId) => {
    // In a real app, this would call an API to remove the item
    const updatedWishlist = wishlistItems.filter((item) => item.id !== itemId);
    setWishlistItems(updatedWishlist);
    toast.success("Item removed from wishlist");
  };

  // Handle adding an item to cart
  const handleAddToCart = (item) => {
    // In a real app, this would call an API to add the item to cart
    toast.success(`${item.name} added to your cart!`);
    // Optionally remove from wishlist after adding to cart
    // handleRemoveFromWishlist(item.id);
  };

  // Navigate to product page
  const navigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishlistItems.length > 0 ? (
        <div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            {/* Wishlist Header (desktop) */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="md:col-span-6">
                <span className="text-sm font-medium">Product</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium">Price</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium">Status</span>
              </div>
              <div className="md:col-span-2 text-right">
                <span className="text-sm font-medium">Action</span>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="divide-y divide-gray-100">
              {wishlistItems.map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="md:grid md:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="md:col-span-6 flex items-center mb-4 md:mb-0">
                      <div
                        className="w-16 h-16 bg-gray-100 rounded-md mr-4 cursor-pointer"
                        onClick={() => navigateToProduct(item.id)}
                      >
                        <img
                          src={item.imageSrc}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3
                          className="font-medium hover:underline cursor-pointer"
                          onClick={() => navigateToProduct(item.id)}
                        >
                          {item.name}
                        </h3>
                        <div className="text-xs text-gray-500 mt-1">
                          Category: {item.category}
                        </div>
                        <div className="text-xs text-gray-500">
                          Added: {formatDate(item.dateAdded)}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2 mb-4 md:mb-0">
                      <div className="flex md:block items-center">
                        <span className="text-sm font-medium md:hidden mr-2">
                          Price:
                        </span>
                        <div>
                          <span className="font-medium">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.originalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="md:col-span-2 mb-4 md:mb-0">
                      <div className="flex md:block items-center">
                        <span className="text-sm font-medium md:hidden mr-2">
                          Status:
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.inStock
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex justify-start md:justify-end space-x-2">
                      <button
                        className={`p-2 rounded-full ${
                          item.inStock
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => item.inStock && handleAddToCart(item)}
                        disabled={!item.inStock}
                        title="Add to Cart"
                      >
                        <ShoppingCart size={16} />
                      </button>
                      <button
                        className="p-2 rounded-full bg-red-50 text-red-500"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        title="Remove from Wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Move All to Cart Button */}
          <div className="flex justify-end">
            <button
              className="bg-black text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => {
                const inStockItems = wishlistItems.filter(
                  (item) => item.inStock
                );
                if (inStockItems.length > 0) {
                  inStockItems.forEach((item) => handleAddToCart(item));
                  toast.success("All available items added to cart");
                } else {
                  toast.error("No items in stock to add to cart");
                }
              }}
            >
              <ShoppingCart size={18} className="mr-2" />
              Add All to Cart
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center bg-gray-100 w-16 h-16 rounded-full mb-4">
            <HeartOff size={24} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-4">
            Save items you love to your wishlist by clicking the heart icon on
            products.
          </p>
          <button
            className="bg-black text-white px-6 py-2 rounded-full"
            onClick={() => navigate("/new-arrivals")}
          >
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
