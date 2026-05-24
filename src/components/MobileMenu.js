import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronUp,
  X,
  ShoppingCart,
  User,
  Heart,
  LogOut,
} from "lucide-react";
import { authService } from "../services/api";
import { toast } from "react-hot-toast";

const MobileMenu = ({ isOpen, setMobileMenuOpen, isLoggedIn }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();

  // Add body scroll lock when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // If menu is not open, return null (don't render anything)
  if (!isOpen) return null;

  const menuCategories = [
    {
      id: "shop",
      name: "Shop",
      submenu: [
        { id: "men", name: "Men", path: "/category/Men" },
        { id: "women", name: "Women", path: "/category/Women" },
        { id: "kids", name: "Kids", path: "/category/Kids" },
        {
          id: "accessories",
          name: "Accessories",
          path: "/category/Accessories",
        },
      ],
    },
    {
      id: "styles",
      name: "Dress Styles",
      submenu: [
        { id: "casual", name: "Casual", path: "/category/Casual" },
        { id: "formal", name: "Formal", path: "/category/Formal" },
        { id: "party", name: "Party", path: "/category/Party" },
        { id: "gym", name: "Gym", path: "/category/Gym" },
      ],
    },
    {
      id: "collections",
      name: "Collections",
      submenu: [
        { id: "new-arrivals", name: "New Arrivals", path: "/new-arrivals" },
        { id: "top-selling", name: "Top Selling", path: "/top-selling" },
        { id: "sale", name: "On Sale", path: "/category/Sale" },
      ],
    },
    {
      id: "contact-us",
      name: "Contact Us",
      path: "/contact",
      submenu: [],
    },
  ];

  const toggleSubmenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Get the search query from the input
    const searchQuery = e.target.elements.searchQuery.value.trim();
    if (searchQuery) {
      // Navigate to search results page with the query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      closeMobileMenu();
    }
  };

  const handleSignOut = () => {
    authService.logout();
    toast.success("You have been signed out successfully");
    closeMobileMenu();
    navigate("/login");
  };

  return (
    <div className="md:hidden fixed inset-0 bg-white z-50 pt-16 pb-4 px-4 overflow-y-auto">
      {/* Close button positioned at the top right */}
      <button
        onClick={closeMobileMenu}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        aria-label="Close menu"
      >
        <X size={24} />
      </button>

      {/* Logo */}
      <div
        className="absolute top-4 left-4 font-plak font-bold text-xl cursor-pointer"
        onClick={() => handleNavigation("/")}
      >
        ATTIRE
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mt-6">
        <div className="relative bg-gray-100 rounded-full flex items-center px-4 py-2 mb-6">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            name="searchQuery"
            placeholder="Search for products..."
            className="bg-transparent ml-2 outline-none text-sm w-full"
          />
        </div>
      </form>

      {/* Menu items */}
      <div className="flex flex-col space-y-4">
        {menuCategories.map((category) => (
          <div key={category.id} className="border-b pb-3">
            {/* Category with direct link or toggle for submenu */}
            {category.submenu.length > 0 ? (
              <div
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => toggleSubmenu(category.id)}
              >
                <span className="font-medium">{category.name}</span>
                {expandedMenu === category.id ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            ) : (
              <div
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => handleNavigation(category.path)}
              >
                <span className="font-medium">{category.name}</span>
              </div>
            )}

            {/* Submenu items */}
            {expandedMenu === category.id && category.submenu.length > 0 && (
              <div className="ml-4 mt-2 space-y-2">
                {category.submenu.map((item) => (
                  <div
                    key={item.id}
                    className="py-1 cursor-pointer text-gray-600"
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Account links */}
      <div className="mt-8 space-y-3">
        <div className="font-medium mb-2">Account</div>

        {isLoggedIn ? (
          <>
            <div
              className="cursor-pointer py-1 text-gray-600 flex items-center"
              onClick={() => handleNavigation("/profile")}
            >
              <User size={16} className="mr-2" />
              My Profile
            </div>
            <div
              className="cursor-pointer py-1 text-gray-600 flex items-center"
              onClick={() => handleNavigation("/profile/orders")}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Orders
            </div>
            <div
              className="cursor-pointer py-1 text-gray-600 flex items-center"
              onClick={() => handleNavigation("/profile/wishlist")}
            >
              <Heart size={16} className="mr-2" />
              Wishlist
            </div>
            <div
              className="cursor-pointer py-1 text-red-500 flex items-center"
              onClick={handleSignOut}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </div>
          </>
        ) : (
          <div
            className="cursor-pointer py-1 text-gray-600 flex items-center"
            onClick={() => handleNavigation("/login")}
          >
            <User size={16} className="mr-2" />
            Sign In / Register
          </div>
        )}
      </div>

      {/* Cart link */}
      <div className="mt-6 border-t pt-4">
        <div
          className="flex items-center py-2 font-medium cursor-pointer"
          onClick={() => handleNavigation("/cart")}
        >
          <ShoppingCart size={18} className="mr-2" />
          Cart
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
