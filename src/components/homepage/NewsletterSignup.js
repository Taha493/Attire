// src/components/homepage/NewsletterSignup.js
import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call
      // await apiClient.post('/newsletter/subscribe', { email });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Mail size={32} className="mx-auto mb-4" />

          <h2 className="font-plak text-3xl font-bold mb-4">
            SIGN UP FOR OUR NEWSLETTER
          </h2>

          <p className="text-gray-300 mb-8">
            Stay updated with our latest collections, exclusive offers, and
            style tips. Subscribe to our newsletter and get 10% off your first
            order.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
            <div className="flex-grow mb-3 sm:mb-0 sm:mr-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-full text-black focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
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
                  Subscribing...
                </span>
              ) : (
                <>
                  Subscribe <ArrowRight size={16} className="ml-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
