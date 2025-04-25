import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const DesktopNavLinks = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  // const navigate = useNavigate();

  const navItems = [
    {
      id: "shop",
      label: "Shop",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Men",
          path: "/category/Men",
          items: [
            { name: "T-Shirts", path: "/category/Men/T-Shirts" },
            { name: "Shirts", path: "/category/Men/Shirts" },
            { name: "Jeans", path: "/category/Men/Jeans" },
            { name: "Jackets", path: "/category/Men/Jackets" },
          ],
        },
        {
          label: "Women",
          path: "/category/Women",
          items: [
            { name: "Dresses", path: "/category/Women/Dresses" },
            { name: "Tops", path: "/category/Women/Tops" },
            { name: "Jeans", path: "/category/Women/Jeans" },
            { name: "Jackets", path: "/category/Women/Jackets" },
          ],
        },
        {
          label: "Kids",
          path: "/category/Kids",
          items: [
            { name: "Boys", path: "/category/Kids/Boys" },
            { name: "Girls", path: "/category/Kids/Girls" },
            { name: "Infants", path: "/category/Kids/Infants" },
          ],
        },
        {
          label: "Accessories",
          path: "/category/Accessories",
          items: [
            { name: "Bags", path: "/category/Accessories/Bags" },
            { name: "Watches", path: "/category/Accessories/Watches" },
            { name: "Jewelry", path: "/category/Accessories/Jewelry" },
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
      path: "/new-arrivals",
    },
    {
      id: "contact-us",
      label: "Contact Us",
      hasDropdown: false,
      path: "/contact",
    },
  ];

  // const handleNavigate = (path) => {
  //   navigate(path);
  //   setActiveDropdown(null);
  // };

  return (
    <div className="hidden md:flex space-x-6 text-sm">
      {navItems.map((item) => (
        <div key={item.id} className="relative">
          <div
            className="flex items-center cursor-pointer py-2"
            onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.id)}
            onMouseLeave={() => setActiveDropdown(null)}
            // onClick={() => !item.hasDropdown && handleNavigate(item.path)}
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
                    // onClick={() => handleNavigate(category.path)}
                  >
                    {category.label}
                  </h3>
                  <ul className="space-y-1">
                    {category.items.map((subItem, subIdx) => (
                      <li
                        key={subIdx}
                        className="text-gray-600 hover:text-black cursor-pointer"
                        // onClick={() => handleNavigate(subItem.path)}
                      >
                        {subItem.name}
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
