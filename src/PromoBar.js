import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PromoBar = ({ showPromoBar, setShowPromoBar, isLoggedIn }) => {
  const navigate = useNavigate();

  if (!showPromoBar) return null;

  const handleSignUpClick = () => {
    // Navigate to the registration page (AuthForm component)
    navigate("/register");
  };

  return (
    <div className="bg-black text-white py-2 px-4 text-center text-xs sm:text-sm relative">
      {isLoggedIn ? (
        // Message for logged-in users
        "Enjoy free shipping on all orders over $100!"
      ) : (
        // Message for non-logged-in users with sign-up link
        <>
          Sign up and get 20% off to your first order.
          <span
            className="font-bold ml-1 cursor-pointer underline"
            onClick={handleSignUpClick}
          >
            Sign Up Now
          </span>
        </>
      )}
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
        onClick={() => setShowPromoBar(false)}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default PromoBar;
