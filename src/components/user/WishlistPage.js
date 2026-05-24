import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeartOff, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { wishlistService, cartService } from "../../services/api";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const response = await wishlistService.getWishlist();
        const formattedItems = response.items.map((product) => ({
          _id: product.id, // Ensure this matches your backend's product ID field
          name: product.name,
          imageSrc: product.imageSrc || "/api/placeholder/240/320",
          price: product.price,
          original: product.originalPrice || null,
          discountPercentage: product.discountPercentage || null,
          rating: product.rating || 0,
          reviewCount: product.reviewCount ? `${product.reviewCount}/5` : "0/5",
          inStock: product.inStock !== undefined ? product.inStock : true,
          category: product.category || "Unknown",
          dateAdded: product.date || new Date().toISOString(),
        }));

        setWishlistItems(formattedItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError(err.message || "Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Handle removing an item from wishlist
  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await wishlistService.removeFromWishlist(itemId);
      // Update state to remove the item with matching _id
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
      toast.success("Item removed from wishlist");
    } catch (err) {
      console.error("Error removing item from wishlist:", err);
      toast.error("Failed to remove item from wishlist");
    }
  };

  // Handle adding an item to cart
  const handleAddToCart = async (item) => {
    try {
      const cartItem = {
        productId: item._id, // Use _id consistently
        quantity: 1,
        size: "Medium",
        color: "Default",
      };
      await cartService.addToCart(cartItem);
      toast.success(`${item.name} added to your cart!`);
      // Do NOT call handleRemoveFromWishlist here
    } catch (err) {
      console.error("Error adding item to cart:", err);
      toast.error("Failed to add item to cart");
    }
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

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-lg font-medium mb-2">Error Loading Wishlist</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          className="bg-black text-white px-6 py-2 rounded-full"
          onClick={() => navigate("/new-arrivals")}
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishlistItems.length > 0 ? (
        <div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
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

            <div className="divide-y divide-gray-100">
              {wishlistItems.map((item) => (
                <div key={item._id} className="px-6 py-4">
                  <div className="md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-6 flex items-center mb-4 md:mb-0">
                      <div
                        className="w-16 h-16 bg-gray-100 rounded-md mr-4 cursor-pointer"
                        onClick={() => navigateToProduct(item._id)}
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
                          onClick={() => navigateToProduct(item._id)}
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
                        onClick={() => handleRemoveFromWishlist(item._id)}
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

          <div className="flex justify-end">
            <button
              className="bg-black text-white px-4 py-2 rounded-md flex items-center"
              onClick={async () => {
                const inStockItems = wishlistItems.filter(
                  (item) => item.inStock
                );
                if (inStockItems.length > 0) {
                  try {
                    for (const item of inStockItems) {
                      await handleAddToCart(item);
                    }
                    toast.success("All available items added to cart");
                  } catch (err) {
                    toast.error("Failed to add some items to cart");
                  }
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
