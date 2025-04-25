// src/components/user/UserProfilePage.js - Updated version with proper data fetching
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ChevronRight,
  User,
  ShoppingBag,
  Heart,
  CreditCard,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";
import ProfileInfo from "./ProfileInfo";
import OrderHistory from "./OrderHistory";
import WishlistPage from "./WishlistPage";
import PaymentMethods from "./PaymentMethods";
import NotificationsPage from "./NotificationsPage";
import AccountSettings from "./AccountSettings";
import OrderDetails from "./OrderDetails";
import { userService, authService } from "../../services/api";
import { toast } from "react-hot-toast";

const UserProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data function
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);

      // If unauthorized, logout and redirect to login
      if (error.response && error.response.status === 401) {
        authService.logout();
        navigate("/login", { state: { from: location.pathname } });
      } else {
        toast.error("Failed to load profile information");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // Determine active tab from URL
    const path = location.pathname;
    if (path.includes("/orders")) {
      setActiveTab("orders");
    } else if (path.includes("/wishlist")) {
      setActiveTab("wishlist");
    } else if (path.includes("/payment")) {
      setActiveTab("payment");
    } else if (path.includes("/notifications")) {
      setActiveTab("notifications");
    } else if (path.includes("/settings")) {
      setActiveTab("settings");
    } else {
      setActiveTab("profile");
    }

    // Fetch user data
    fetchUserData();
  }, [navigate, location.pathname]);

  const handleSignOut = () => {
    // Handle sign out logic
    authService.logout();
    toast.success("You have been signed out successfully");
    navigate("/login");
  };

  // src/components/user/UserProfilePage.js (continued)
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  const navItems = [
    {
      id: "profile",
      label: "Profile Information",
      icon: <User size={20} />,
      path: "/profile",
    },
    {
      id: "orders",
      label: "Order History",
      icon: <ShoppingBag size={20} />,
      path: "/profile/orders",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: <Heart size={20} />,
      path: "/profile/wishlist",
    },
    {
      id: "payment",
      label: "Payment Methods",
      icon: <CreditCard size={20} />,
      path: "/profile/payment",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
      path: "/profile/notifications",
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: <Settings size={20} />,
      path: "/profile/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">My Account</span>
          {activeTab !== "profile" && (
            <>
              <ChevronRight size={14} className="mx-2 text-gray-400" />
              <span className="font-medium">
                {navItems.find((item) => item.id === activeTab)?.label}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            {/* User Info Card */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                <img
                  src={user?.profilePicture || "/api/placeholder/128/128"}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-medium">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="bg-gray-50 rounded-lg overflow-hidden">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm ${
                    activeTab === item.id
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-3 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
              >
                <LogOut size={20} className="mr-3" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-gray-50 rounded-lg p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <ProfileInfo user={user} refreshUser={fetchUserData} />
                }
              />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/payment" element={<PaymentMethods />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route
                path="/settings"
                element={
                  <AccountSettings user={user} refreshUser={fetchUserData} />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
