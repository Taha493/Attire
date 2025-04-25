// src/components/category/SizeFilters.js
import React from "react";

const SizeFilters = ({ selectedSizes = [], onChange }) => {
  // Available sizes
  const sizes = [
    { id: "xx-small", label: "XX-Small" },
    { id: "x-small", label: "X-Small" },
    { id: "small", label: "Small" },
    { id: "medium", label: "Medium" },
    { id: "large", label: "Large" },
    { id: "x-large", label: "X-Large" },
    { id: "xx-large", label: "XX-Large" },
    { id: "3x-large", label: "3X-Large" },
    { id: "4x-large", label: "4X-Large" },
  ];

  const toggleSize = (sizeId) => {
    let newSelectedSizes;

    if (selectedSizes.includes(sizeId)) {
      // Remove size if already selected
      newSelectedSizes = selectedSizes.filter((id) => id !== sizeId);
    } else {
      // Add size if not selected
      newSelectedSizes = [...selectedSizes, sizeId];
    }

    if (onChange) {
      onChange(newSelectedSizes);
    }
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {sizes.map((size) => (
        <SizeOption
          key={size.id}
          label={size.label}
          selected={selectedSizes.includes(size.id)}
          onClick={() => toggleSize(size.id)}
        />
      ))}
    </div>
  );
};

const SizeOption = ({ label, selected = false, onClick }) => (
  <button
    className={`py-2 px-4 text-xs rounded-full ${
      selected
        ? "bg-black text-white"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default SizeFilters;
