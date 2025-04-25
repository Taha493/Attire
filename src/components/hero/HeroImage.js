import React from "react";
import Image from "../../assests/model2.png";

const HeroImage = () => {
  return (
    <div className="md:w-1/2 relative">
      {/* Decorative stars with responsive sizing */}
      <div className="absolute -top-4 sm:-top-6 right-4 sm:right-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        ✦
      </div>
      <div className="absolute bottom-8 sm:bottom-12 left-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        ✦
      </div>

      {/* Main image with responsive container */}
      <div className="px-4 sm:px-6 md:px-0">
        <img
          src={Image}
          alt="Stylish model wearing fashionable clothing"
          className="rounded-lg w-full h-auto shadow-sm"
        />
      </div>
    </div>
  );
};

export default HeroImage;
