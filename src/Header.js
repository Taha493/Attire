import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, ShoppingCart, User, Heart } from "lucide-react";
import DesktopNavLinks from "./components/navigation/DesktopNavLinks";
import SearchBar from "./components/navigation/SearchBar";
import { cartService, wishlistService, authService } from "./services/api";

const Header = ({ setMobileMenuOpen, isLoggedIn }) => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Fetch cart and wishlist counts when authenticated
  useEffect(() => {
    const fetchCounts = async () => {
      if (isLoggedIn) {
        try {
          // Fetch cart data
          const cartData = await cartService.getCart();
          if (cartData && cartData.items) {
            setCartItemCount(cartData.items.length);
          }

          // Fetch wishlist data
          const wishlistData = await wishlistService.getWishlist();
          if (wishlistData) {
            setWishlistCount(wishlistData.count || 0);
          }
        } catch (error) {
          console.error("Error fetching cart/wishlist data:", error);
        }
      } else {
        // Reset counts when logged out
        setCartItemCount(0);
        setWishlistCount(0);
      }
    };

    fetchCounts();
  }, [isLoggedIn]);

  // Function to navigate to cart page
  const navigateToCart = () => {
    navigate("/cart");
  };

  // Function to navigate to user profile
  const navigateToProfile = () => {
    // Check if user is logged in
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login", { state: { from: window.location.pathname } });
    }
  };

  // Function to navigate to wishlist
  const navigateToWishlist = () => {
    if (isLoggedIn) {
      navigate("/profile/wishlist");
    } else {
      navigate("/login", { state: { from: "/profile/wishlist" } });
    }
  };

  // Function to navigate to home
  const navigateToHome = () => {
    navigate("/");
  };

  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="py-3 px-4 sm:py-4 sm:px-6 flex items-center justify-between">
      {/* Mobile Menu Button - on left for mobile */}
      <button
        className="md:hidden flex items-center order-first"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <Menu size={20} />
      </button>

      {/* Logo - centered on mobile, left on desktop */}
      <a
        href="/"
        className="font-plak font-bold text-xl sm:text-2xl md:order-first mx-auto md:mx-0 md:ml-10"
        onClick={(e) => {
          e.preventDefault();
          navigateToHome();
        }}
      >
        ATTIRE
      </a>

      {/* Desktop Navigation */}
      <DesktopNavLinks />

      <div className="flex items-center space-x-2 sm:space-x-4">
        <SearchBar />

        {/* Wishlist icon */}
        <div className="relative cursor-pointer" onClick={navigateToWishlist}>
          <Heart size={18} />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>

        {/* Cart icon with counter */}
        <div className="relative cursor-pointer" onClick={navigateToCart}>
          <ShoppingCart size={18} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>

        {/* User profile icon */}
        <User
          size={18}
          className="cursor-pointer"
          onClick={navigateToProfile}
        />
      </div>
    </nav>
  );
};

export default Header;
