// src/components/CategoryGrid.js
import React from "react";
import CategoryCard from "./CategoryCard";
import CasualModel from "../../assests/casual.png";

function CategoryGrid() {
  const categories = [
    {
      id: 1,
      title: "Casual",
      imageSrc: CasualModel,
      imageAlt: "Casual style - man in white t-shirt with pocket",
    },
    {
      id: 2,
      title: "Formal",
      imageSrc: "/api/placeholder/400/320",
      imageAlt: "Formal style - man in checkered blazer",
    },
    {
      id: 3,
      title: "Party",
      imageSrc: "/api/placeholder/400/320",
      imageAlt: "Party style - woman in sparkly top",
    },
    {
      id: 4,
      title: "Gym",
      imageSrc: "/api/placeholder/400/320",
      imageAlt: "Gym style - person lifting weights",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          title={category.title}
          imageSrc={category.imageSrc}
          imageAlt={category.imageAlt}
        />
      ))}
    </div>
  );
}

export default CategoryGrid;
