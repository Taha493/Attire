// src/components/category/ColorFilters.js
import React from "react";

const ColorFilters = ({ selectedColors = [], onChange }) => {
  // Available colors
  const colors = [
    { id: "green", value: "#4CAF50", name: "Green" },
    { id: "red", value: "#F44336", name: "Red" },
    { id: "yellow", value: "#FFC107", name: "Yellow" },
    { id: "orange", value: "#FF9800", name: "Orange" },
    { id: "light-blue", value: "#03A9F4", name: "Light Blue" },
    { id: "indigo", value: "#3F51B5", name: "Indigo" },
    { id: "purple", value: "#9C27B0", name: "Purple" },
    { id: "pink", value: "#E91E63", name: "Pink" },
    { id: "white", value: "#FFFFFF", name: "White", border: true },
    { id: "black", value: "#000000", name: "Black" },
  ];

  const toggleColor = (colorId) => {
    let newSelectedColors;

    if (selectedColors.includes(colorId)) {
      // Remove color if already selected
      newSelectedColors = selectedColors.filter((id) => id !== colorId);
    } else {
      // Add color if not selected
      newSelectedColors = [...selectedColors, colorId];
    }

    if (onChange) {
      onChange(newSelectedColors);
    }
  };

  return (
    <div className="mt-4 grid grid-cols-5 gap-2">
      {colors.map((color) => (
        <ColorOption
          key={color.id}
          color={color.value}
          border={color.border}
          selected={selectedColors.includes(color.id)}
          onClick={() => toggleColor(color.id)}
          aria-label={color.name}
        />
      ))}
    </div>
  );
};

const ColorOption = ({
  color,
  border = false,
  selected = false,
  onClick,
  ...props
}) => (
  <button
    className={`w-8 h-8 rounded-full ${
      border ? "border border-gray-300" : ""
    } ${selected ? "ring-2 ring-offset-2 ring-black" : ""}`}
    style={{ backgroundColor: color }}
    onClick={onClick}
    {...props}
  />
);

export default ColorFilters;
