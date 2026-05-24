// src/components/auth/AuthForm.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { authService } from "../../services/api";

const AuthForm = ({ isRegister: initialIsRegister }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if this is the register or login page based on prop or URL
  const [isRegister, setIsRegister] = useState(
    initialIsRegister || location.pathname === "/register"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Add states to control when autofill should be allowed and password visibility
  const [allowAutofill, setAllowAutofill] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  // Add an effect to enable autofill after the component mounts
  useEffect(() => {
    // Wait for a short delay before enabling autofill
    const timer = setTimeout(() => {
      setAllowAutofill(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      // If user is already logged in and trying to access login/register page,
      // redirect to the dashboard or intended page
      const from = location.state?.from || "/dashboard";
      navigate(from);
    }
  }, [navigate, location.state]);

  // Add an effect to handle URL changes for login/register
  useEffect(() => {
    setIsRegister(location.pathname === "/register");
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Clear previous errors
    setError("");

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (isRegister) {
      // Name validation
      if (!name.trim()) {
        setError("Name is required");
        return false;
      }

      // Password validation
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    } else {
      // Login validation
      if (!password) {
        setError("Password is required");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Register user
        await authService.register({
          name,
          email,
          password,
        });

        toast.success("Registration successful!");
      } else {
        // Login user
        await authService.login({
          email,
          password,
        });

        toast.success("Login successful!");
      }

      // Get redirect path from location state or default to dashboard
      const from = location.state?.from || "/dashboard";
      navigate(from);
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.message ||
          "Authentication failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      if (!credentialResponse.credential) {
        throw new Error(
          "Google authentication failed. No credential received."
        );
      }

      // Call Google authentication API
      await authService.googleLogin(credentialResponse.credential);

      toast.success("Google authentication successful!");

      // Get redirect path from location state or default to dashboard
      const from = location.state?.from || "/dashboard";
      navigate(from);
    } catch (err) {
      console.error("Google auth error:", err);
      setError(
        err.message || "Google authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google authentication error
  const handleGoogleError = () => {
    setError("Google sign in was unsuccessful. Please try again.");
  };

  // Function to enable autofill when user clicks on input
  const enableAutofill = () => {
    if (!allowAutofill) {
      setAllowAutofill(true);
    }
  };

  // Toggle between login and register forms
  const toggleAuthMode = () => {
    navigate(isRegister ? "/login" : "/register");
    setIsRegister(!isRegister);
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-plak">
            {isRegister ? "Create a new account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegister
              ? "Join us to get personalized recommendations and exclusive offers."
              : "Welcome back! Please sign in to continue."}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {isRegister && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isRegister}
                  value={name}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  // Prevent autofill initially
                  autoComplete={allowAutofill ? "name" : "off"}
                  onClick={enableAutofill}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="Email address"
                // Prevent autofill initially
                autoComplete={allowAutofill ? "username" : "new-password"}
                onClick={enableAutofill}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="Password"
                  // Prevent autofill initially
                  autoComplete={
                    allowAutofill
                      ? isRegister
                        ? "new-password"
                        : "current-password"
                      : "new-password"
                  }
                  onClick={enableAutofill}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-gray-500" />
                  ) : (
                    <Eye size={16} className="text-gray-500" />
                  )}
                </button>
              </div>
              {isRegister && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {isRegister && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required={isRegister}
                    value={confirmPassword}
                    onChange={handleChange}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    // Prevent autofill initially
                    autoComplete={allowAutofill ? "new-password" : "off"}
                    onClick={enableAutofill}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} className="text-gray-500" />
                    ) : (
                      <Eye size={16} className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="enable-autofill"
              name="enable-autofill"
              type="checkbox"
              checked={allowAutofill}
              onChange={(e) => setAllowAutofill(e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label
              htmlFor="enable-autofill"
              className="ml-2 block text-sm text-gray-900"
            >
              Allow browser to save credentials
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Processing...
                </span>
              ) : isRegister ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              shape="rectangular"
              text="signin_with"
              width="300"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleAuthMode}
            className="font-medium text-black hover:text-gray-800"
          >
            {isRegister
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
