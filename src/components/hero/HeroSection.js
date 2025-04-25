import React from "react";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  return (
    <div className="bg-gray-50 py-8 sm:py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <HeroContent />
        <HeroImage />
      </div>
    </div>
  );
};

export default HeroSection;
