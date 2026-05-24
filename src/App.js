// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import AuthForm from "./components/auth/AuthForm";
import PrivateRoute from "./components/auth/PrivateRoute";
import Footer from "./Footer";
import PromoBar from "./PromoBar";
import Header from "./Header";
import MobileMenu from "./components/MobileMenu";
import Dashboard from "./components/Dashboard";
import CategoryPage from "./components/category/CategoryPage";
import CartPage from "./components/cart/CartPage";
import CheckoutPage from "./components/checkout/CheckoutPage";
import ProductCatelog from "./components/product/ProductPage";
import NewArrivals from "./components/ProductShowcase/NewArrivals";
import TopSelling from "./components/ProductShowcase/TopSelling";
import AllCategoriesPage from "./components/product/AllCategoriesPage";
import OrderConfirmationPage from "./components/checkout/OrderConfirmationPage";
import UserProfilePage from "./components/user/UserProfilePage";
import ContactUs from "./components/contact/ContactUs";
import { authService } from "./services/api";

function App() {
  const [showPromoBar, setShowPromoBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsLoggedIn(authenticated);
    };

    // Check initially
    checkAuth();

    // storage fires in OTHER tabs; authChange fires in the SAME tab
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId="478863475650-p497sr5ej197eso3a634udolpe9i48nj.apps.googleusercontent.com">
      <Toaster position="top-center" />
      <Router>
        <PromoBar
          showPromoBar={showPromoBar}
          setShowPromoBar={setShowPromoBar}
          isLoggedIn={isLoggedIn}
        />
        <Header setMobileMenuOpen={setMobileMenuOpen} isLoggedIn={isLoggedIn} />
        <MobileMenu
          isOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          isLoggedIn={isLoggedIn}
        />

        <Routes>
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<AuthForm isRegister={true} />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/category/:categoryName/:subcategoryName?"
            element={<CategoryPage />}
          />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/product/:productId" element={<ProductCatelog />} />
          <Route
            path="/category/:categoryName/product/:productId"
            element={<ProductCatelog />}
          />
          <Route path="/products/new-arrivals" element={<NewArrivals />} />
          <Route path="/products/top-selling" element={<TopSelling />} />
          <Route path="/related/:productId" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              <PrivateRoute>
                <OrderConfirmationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/*"
            element={
              <PrivateRoute>
                <UserProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center flex-col py-10 px-4">
                <h1 className="font-plak text-3xl mb-4">Page Not Found</h1>
                <p className="text-gray-600 mb-6">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-black text-white px-6 py-3 rounded-full mb-4"
                >
                  Go Back
                </button>
                <a href="/" className="text-gray-500 hover:text-black">
                  Return to Homepage
                </a>
              </div>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
