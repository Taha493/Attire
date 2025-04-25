import React from "react";
import HeroSection from "../components/hero/HeroSection";
import ProductShowcase from "../components/ProductShowcase/ProductShowcase";
import BrowseByDressStyle from "./BrowseByStyle/BrowseByDressStyle";
import CustomerReviews from "./Reviews/CustomerReviews";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Product Showcase (New Arrivals & Top Selling) */}
      <ProductShowcase />

      <BrowseByDressStyle />

      <CustomerReviews />
    </div>
  );
}
