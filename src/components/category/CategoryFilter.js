// src/components/category/CategoryFilters.js
import React from "react";
import { ChevronRight } from "lucide-react";

const CategoryFilters = ({ currentCategory, onCategoryChange }) => {
  // Available dress style categories
  const categories = [
    { id: "casual", label: "Casual" },
    { id: "formal", label: "Formal" },
    { id: "party", label: "Party" },
    { id: "gym", label: "Gym" },
  ];

  return (
    <div className="mt-3">
      {categories.map((category) => (
        <FilterItem
          key={category.id}
          label={category.label}
          hasChildren={true}
          isActive={currentCategory === category.label}
          onClick={() => onCategoryChange(category.label)}
        />
      ))}
    </div>
  );
};

const FilterItem = ({
  label,
  hasChildren = false,
  isActive = false,
  onClick,
}) => (
  <div
    className="py-2 flex items-center justify-between cursor-pointer"
    onClick={onClick}
  >
    <span
      className={`text-sm ${
        isActive ? "font-medium" : "text-gray-500 hover:text-black"
      }`}
    >
      {label}
    </span>
    {hasChildren && <ChevronRight size={16} className="text-gray-400" />}
  </div>
);

export default CategoryFilters;
