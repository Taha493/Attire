import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const DesktopNavLinks = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const navItems = [
    {
      id: "shop",
      label: "Shop",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Men",
          category: "Men",
          path: "/category/Men",
          subcategories: [
            {
              name: "T-Shirts",
              subcategory: "T-Shirts",
              path: "/category/Men/T-Shirts",
            },
            {
              name: "Shirts",
              subcategory: "Shirts",
              path: "/category/Men/Shirts",
            },
            {
              name: "Jeans",
              subcategory: "Jeans",
              path: "/category/Men/Jeans",
            },
            {
              name: "Jackets",
              subcategory: "Jackets",
              path: "/category/Men/Jackets",
            },
          ],
        },
        {
          label: "Women",
          category: "Women",
          path: "/category/Women",
          subcategories: [
            {
              name: "Dresses",
              subcategory: "Dresses",
              path: "/category/Women/Dresses",
            },
            { name: "Tops", subcategory: "Tops", path: "/category/Women/Tops" },
            {
              name: "Jeans",
              subcategory: "Jeans",
              path: "/category/Women/Jeans",
            },
            {
              name: "Jackets",
              subcategory: "Jackets",
              path: "/category/Women/Jackets",
            },
          ],
        },
        {
          label: "Kids",
          category: "Kids",
          path: "/category/Kids",
          subcategories: [
            { name: "Boys", subcategory: "Boys", path: "/category/Kids/Boys" },
            {
              name: "Girls",
              subcategory: "Girls",
              path: "/category/Kids/Girls",
            },
            {
              name: "Infants",
              subcategory: "Infants",
              path: "/category/Kids/Infants",
            },
          ],
        },
        {
          label: "Accessories",
          category: "Accessories",
          path: "/category/Accessories",
          subcategories: [
            {
              name: "Bags",
              subcategory: "Bags",
              path: "/category/Accessories/Bags",
            },
            {
              name: "Watches",
              subcategory: "Watches",
              path: "/category/Accessories/Watches",
            },
            {
              name: "Jewelry",
              subcategory: "Jewelry",
              path: "/category/Accessories/Jewelry",
            },
          ],
        },
      ],
    },
    {
      id: "sale",
      label: "On Sale",
      hasDropdown: false,
      path: "/category/Sale",
    },
    {
      id: "new",
      label: "New Arrivals",
      hasDropdown: false,
      path: "/products/new-arrivals",
    },
    {
      id: "contact-us",
      label: "Contact Us",
      hasDropdown: false,
      path: "/contact",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setActiveDropdown(null);
  };

  return (
    <div className="hidden md:flex space-x-6 text-sm">
      {navItems.map((item) => (
        <div key={item.id} className="relative">
          <div
            className="flex items-center cursor-pointer py-2"
            onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.id)}
            onMouseLeave={() => setActiveDropdown(null)}
            onClick={() => !item.hasDropdown && handleNavigate(item.path)}
          >
            {item.label}
            {item.hasDropdown && (
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            )}
          </div>

          {/* Dropdown Menu */}
          {item.hasDropdown && activeDropdown === item.id && (
            <div
              className="absolute top-full left-0 z-20 bg-white shadow-lg rounded-lg py-4 px-6 w-screen max-w-4xl flex"
              onMouseEnter={() => setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.dropdownItems.map((category, idx) => (
                <div key={idx} className="flex-1 min-w-40">
                  <h3
                    className="font-medium mb-2 cursor-pointer hover:text-gray-600"
                    onClick={() => handleNavigate(category.path)}
                  >
                    {category.label}
                  </h3>
                  <ul className="space-y-1">
                    {category.subcategories.map((subcategory, subIdx) => (
                      <li
                        key={subIdx}
                        className="text-gray-600 hover:text-black cursor-pointer"
                        onClick={() => handleNavigate(subcategory.path)}
                      >
                        {subcategory.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DesktopNavLinks;
