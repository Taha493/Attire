import React from "react";
import Stats from "./Stats";

const HeroContent = () => {
  return (
    <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left px-2 sm:px-0">
      <h1 className="font-plak text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        FIND CLOTHES
        <br />
        THAT MATCHES
        <br />
        YOUR STYLE
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-lg mx-auto md:mx-0">
        Browse through our diverse range of meticulously crafted garments,
        designed to bring out your individuality and cater to your sense of
        style.
      </p>
      <button className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all hover:bg-gray-800">
        Shop Now
      </button>

      {/* Stats */}
      <Stats />
    </div>
  );
};

export default HeroContent;
