// import React, { useState, useEffect, useRef } from "react";
// import { ChevronRight, Filter, X } from "lucide-react";
// import ProductCard from "../ProductCard/ProductCard";
// import PriceRangeSlider from "../category/PriceRangeSlider";
// import ColorFilters from "../category/ColorFilter";
// import SizeFilters from "../category/SizeFilter";
// import CategoryFilters from "../category/CategoryFilter";
// import { productService } from "../../services/api";

// const NewArrivals = () => {
//   const [priceRange, setPriceRange] = useState([50, 200]);
//   const [selectedColors, setSelectedColors] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [sortBy, setSortBy] = useState("Most Popular");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [expandedFilters, setExpandedFilters] = useState({
//     price: true,
//     colors: true,
//     size: true,
//     dressStyle: true,
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const pageTopRef = useRef(null);

//   useEffect(() => {
//     // Scroll to top when component mounts
//     if (pageTopRef.current) {
//       pageTopRef.current.scrollIntoView({ behavior: "smooth" });
//     }

//     // Fetch new arrivals products
//     const fetchNewArrivals = async () => {
//       try {
//         setLoading(true);
//         const newArrivalsData = await productService.getNewArrivals({
//           limit: 20, // Increased limit to allow for more products
//         });
//         setProducts(newArrivalsData);
//       } catch (err) {
//         console.error("Error fetching new arrivals:", err);
//         setError("Failed to load new arrivals. Please try again later.");
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNewArrivals();
//     // Reset to page 1 and hide mobile filters on mount
//     setCurrentPage(1);
//     setShowFilters(false);
//   }, []);

//   // Toggle filter sections
//   const toggleFilter = (filter) => {
//     setExpandedFilters({
//       ...expandedFilters,
//       [filter]: !expandedFilters[filter],
//     });
//   };

//   // Toggle mobile filters visibility
//   const toggleMobileFilters = () => {
//     setShowFilters(!showFilters);
//   };

//   // Pagination
//   const productsPerPage = 6;
//   const pageCount = Math.ceil(products.length / productsPerPage);
//   const paginatedProducts = products.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= pageCount) {
//       setCurrentPage(page);
//       if (pageTopRef.current) {
//         pageTopRef.current.scrollIntoView({ behavior: "smooth" });
//       }
//     }
//   };

//   // Handle category change
//   const handleCategoryChange = (newCategory) => {
//     window.location.href = `/category/${newCategory}`;
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center">
//         <div className="text-center text-red-500">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white" ref={pageTopRef}>
//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Breadcrumb Navigation */}
//         <div className="flex items-center text-sm mb-6">
//           <a href="/" className="text-gray-500 hover:text-black">
//             Home
//           </a>
//           <ChevronRight size={14} className="mx-2 text-gray-400" />
//           <span className="font-medium">New Arrivals</span>
//         </div>

//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Mobile Filter Toggle Button */}
//           <button
//             className="md:hidden flex items-center justify-center w-full py-3 px-4 mb-4 border border-gray-300 rounded-full font-medium text-sm"
//             onClick={toggleMobileFilters}
//           >
//             <Filter size={16} className="mr-2" />
//             Filters
//           </button>

//           {/* Mobile Filters Overlay */}
//           {showFilters && (
//             <div className="fixed inset-0 z-50 bg-white p-4 overflow-y-auto md:hidden">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="font-plak text-xl font-bold">Filters</h2>
//                 <button
//                   onClick={toggleMobileFilters}
//                   className="p-2 rounded-full hover:bg-gray-100"
//                   aria-label="Close filters"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               {/* Mobile Filters Content */}
//               <div className="mb-6">
//                 <h3 className="font-medium mb-3">Product Type</h3>
//                 <FilterItem label="T-shirts" hasChildren={true} />
//                 <FilterItem label="Shorts" hasChildren={true} />
//                 <FilterItem label="Shirts" hasChildren={true} />
//                 <FilterItem label="Hoodie" hasChildren={true} />
//                 <FilterItem label="Jeans" hasChildren={true} />
//               </div>

//               {/* Price Filter */}
//               <div className="mb-6">
//                 <FilterHeader
//                   label="Price"
//                   isExpanded={expandedFilters.price}
//                   onToggle={() => toggleFilter("price")}
//                 />
//                 {expandedFilters.price && (
//                   <PriceRangeSlider
//                     initialRange={priceRange}
//                     onChange={setPriceRange}
//                   />
//                 )}
//               </div>

//               {/* Colors Filter */}
//               <div className="mb-6">
//                 <FilterHeader
//                   label="Colors"
//                   isExpanded={expandedFilters.colors}
//                   onToggle={() => toggleFilter("colors")}
//                 />
//                 {expandedFilters.colors && (
//                   <ColorFilters
//                     selectedColors={selectedColors}
//                     onChange={setSelectedColors}
//                   />
//                 )}
//               </div>

//               {/* Size Filter */}
//               <div className="mb-6">
//                 <FilterHeader
//                   label="Size"
//                   isExpanded={expandedFilters.size}
//                   onToggle={() => toggleFilter("size")}
//                 />
//                 {expandedFilters.size && (
//                   <SizeFilters
//                     selectedSizes={selectedSizes}
//                     onChange={setSelectedSizes}
//                   />
//                 )}
//               </div>

//               {/* Dress Style Filter */}
//               <div className="mb-6">
//                 <FilterHeader
//                   label="Dress Style"
//                   isExpanded={expandedFilters.dressStyle}
//                   onToggle={() => toggleFilter("dressStyle")}
//                 />
//                 {expandedFilters.dressStyle && (
//                   <CategoryFilters
//                     currentCategory="New Arrivals"
//                     onCategoryChange={handleCategoryChange}
//                   />
//                 )}
//               </div>

//               {/* Apply Filter Button */}
//               <div className="sticky bottom-0 pt-4 pb-6 bg-white">
//                 <button
//                   className="w-full py-3 bg-black text-white rounded-full font-medium"
//                   onClick={toggleMobileFilters}
//                 >
//                   Apply Filter
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Desktop Filters Section */}
//           <div className="hidden md:block w-64 shrink-0">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-bold text-lg">Filters</h2>
//               <button className="text-gray-400">
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   fill="none"
//                 >
//                   <path
//                     d="M4 6h16M4 12h16m-7 6h7"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Product Type Filter */}
//             <div className="mb-6">
//               <FilterItem label="T-shirts" hasChildren={true} />
//               <FilterItem label="Shorts" hasChildren={true} />
//               <FilterItem label="Shirts" hasChildren={true} />
//               <FilterItem label="Hoodie" hasChildren={true} />
//               <FilterItem label="Jeans" hasChildren={true} />
//             </div>

//             {/* Price Filter */}
//             <div className="mb-6">
//               <FilterHeader
//                 label="Price"
//                 isExpanded={expandedFilters.price}
//                 onToggle={() => toggleFilter("price")}
//               />
//               {expandedFilters.price && (
//                 <PriceRangeSlider
//                   initialRange={priceRange}
//                   onChange={setPriceRange}
//                 />
//               )}
//             </div>

//             {/* Colors Filter */}
//             <div className="mb-6">
//               <FilterHeader
//                 label="Colors"
//                 isExpanded={expandedFilters.colors}
//                 onToggle={() => toggleFilter("colors")}
//               />
//               {expandedFilters.colors && (
//                 <ColorFilters
//                   selectedColors={selectedColors}
//                   onChange={setSelectedColors}
//                 />
//               )}
//             </div>

//             {/* Size Filter */}
//             <div className="mb-6">
//               <FilterHeader
//                 label="Size"
//                 isExpanded={expandedFilters.size}
//                 onToggle={() => toggleFilter("size")}
//               />
//               {expandedFilters.size && (
//                 <SizeFilters
//                   selectedSizes={selectedSizes}
//                   onChange={setSelectedSizes}
//                 />
//               )}
//             </div>

//             {/* Dress Style Filter */}
//             <div className="mb-6">
//               <FilterHeader
//                 label="Dress Style"
//                 isExpanded={expandedFilters.dressStyle}
//                 onToggle={() => toggleFilter("dressStyle")}
//               />
//               {expandedFilters.dressStyle && (
//                 <CategoryFilters
//                   currentCategory="New Arrivals"
//                   onCategoryChange={handleCategoryChange}
//                 />
//               )}
//             </div>

//             {/* Apply Filter Button */}
//             <button className="w-full py-3 bg-black text-white rounded-full font-medium">
//               Apply Filter
//             </button>
//           </div>

//           {/* Products Section */}
//           <div className="flex-1">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//               <h1 className="text-2xl font-bold mb-2 sm:mb-0">New Arrivals</h1>
//               <div className="flex items-center text-sm">
//                 <span className="text-gray-500">
//                   Showing {products.length > 0 ? 1 : 0}-
//                   {paginatedProducts.length} of {products.length} Products
//                 </span>
//                 <div className="ml-4 flex items-center">
//                   <span className="mr-2">Sort by:</span>
//                   <div className="relative group">
//                     <button className="flex items-center font-medium">
//                       {sortBy}
//                       <svg
//                         className="ml-1 w-4 h-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 9l-7 7-7-7"
//                         />
//                       </svg>
//                     </button>
//                     <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
//                       <div className="py-1">
//                         <button
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                           onClick={() => setSortBy("Most Popular")}
//                         >
//                           Most Popular
//                         </button>
//                         <button
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                           onClick={() => setSortBy("Newest")}
//                         >
//                           Newest
//                         </button>
//                         <button
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                           onClick={() => setSortBy("Price: Low to High")}
//                         >
//                           Price: Low to High
//                         </button>
//                         <button
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                           onClick={() => setSortBy("Price: High to Low")}
//                         >
//                           Price: High to Low
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Product Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {paginatedProducts.map((product) => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>

//             {/* Pagination */}
//             {pageCount > 0 && (
//               <div className="flex justify-between items-center mt-10">
//                 <button
//                   className="flex items-center text-sm font-medium"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <svg
//                     className="mr-1 w-4 h-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                   Previous
//                 </button>
//                 <div className="flex items-center space-x-1">
//                   {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => (
//                     <button
//                       key={i}
//                       className={`w-8 h-8 flex items-center justify-center rounded-md ${
//                         currentPage === i + 1
//                           ? "bg-black text-white"
//                           : "text-gray-500 hover:bg-gray-100"
//                       }`}
//                       onClick={() => handlePageChange(i + 1)}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   {pageCount > 7 && (
//                     <>
//                       <span className="w-8 h-8 flex items-center justify-center">
//                         ...
//                       </span>
//                       <button
//                         className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
//                         onClick={() => handlePageChange(pageCount)}
//                       >
//                         {pageCount}
//                       </button>
//                     </>
//                   )}
//                 </div>
//                 <button
//                   className="flex items-center text-sm font-medium"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === pageCount}
//                 >
//                   Next
//                   <svg
//                     className="ml-1 w-4 h-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper Components for Filters
// const FilterHeader = ({ label, isExpanded, onToggle }) => (
//   <div
//     className="flex justify-between items-center cursor-pointer"
//     onClick={onToggle}
//   >
//     <h3 className="font-medium">{label}</h3>
//     {isExpanded ? (
//       <svg
//         className="w-4 h-4"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M5 15l7-7 7 7"
//         />
//       </svg>
//     ) : (
//       <svg
//         className="w-4 h-4"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M19 9l-7 7-7-7"
//         />
//       </svg>
//     )}
//   </div>
// );

// const FilterItem = ({
//   label,
//   hasChildren = false,
//   isActive = false,
//   onClick,
// }) => (
//   <div
//     className="py-2 flex items-center justify-between cursor-pointer"
//     onClick={onClick}
//   >
//     <span
//       className={`text-sm ${
//         isActive ? "font-medium" : "text-gray-500 hover:text-black"
//       }`}
//     >
//       {label}
//     </span>
//     {hasChildren && (
//       <svg
//         className="w-4 h-4 text-gray-400"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M9 5l7 7-7 7"
//         />
//       </svg>
//     )}
//   </div>
// );

// export default NewArrivals;

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Filter, X } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import PriceRangeSlider from "../category/PriceRangeSlider";
import ColorFilters from "../category/ColorFilter";
import SizeFilters from "../category/SizeFilter";
import CategoryFilters from "../category/CategoryFilter";

const NewArrivals = () => {
  const [priceRange, setPriceRange] = useState([50, 200]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState("Most Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    colors: true,
    size: true,
    dressStyle: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageTopRef = useRef(null);

  useEffect(() => {
    // Scroll to top when component mounts
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Load mock new arrivals products
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        // Mock data for new arrivals
        const mockProducts = [
          {
            _id: "1",
            name: "New Graphic T-shirt",
            imageSrc: "/api/placeholder/240/320",
            rating: 4.0,
            reviewCount: "4.0/5",
            currentPrice: 150,
            originalPrice: null,
            discountPercentage: null,
            category: "Casual",
          },
          {
            _id: "2",
            name: "Slim Fit Polo",
            imageSrc: "/api/placeholder/240/320",
            rating: 4.5,
            reviewCount: "4.5/5",
            currentPrice: 175,
            originalPrice: 200,
            discountPercentage: 12,
            category: "Casual",
          },
          {
            _id: "3",
            name: "Striped Hoodie",
            imageSrc: "/api/placeholder/240/320",
            rating: 4.8,
            reviewCount: "4.8/5",
            currentPrice: 190,
            originalPrice: null,
            discountPercentage: null,
            category: "Casual",
          },
          {
            _id: "4",
            name: "Denim Jacket",
            imageSrc: "/api/placeholder/240/320",
            rating: 4.2,
            reviewCount: "4.2/5",
            currentPrice: 220,
            originalPrice: 250,
            discountPercentage: 12,
            category: "Casual",
          },
          {
            _id: "5",
            name: "Chino Shorts",
            imageSrc: "/api/placeholder/240/320",
            rating: 3.9,
            reviewCount: "3.9/5",
            currentPrice: 110,
            originalPrice: null,
            discountPercentage: null,
            category: "Casual",
          },
          {
            _id: "6",
            name: "Formal Blazer",
            imageSrc: "/api/placeholder/240/320",
            rating: 4.7,
            reviewCount: "4.7/5",
            currentPrice: 300,
            originalPrice: 350,
            discountPercentage: 14,
            category: "Formal",
          },
          {
            _id: "7",
            name: "Sneakers",
            imageSrc: "/api/placeholder/240/320",
            rating: 4.3,
            reviewCount: "4.3/5",
            currentPrice: 180,
            originalPrice: null,
            discountPercentage: null,
            category: "Casual",
          },
          {
            _id: "8",
            name: "Printed Shirt",
            imageSrc: "/api/placeholder/240/320",
            rating: 4.1,
            reviewCount: "4.1/5",
            currentPrice: 160,
            originalPrice: 180,
            discountPercentage: 11,
            category: "Casual",
          },
        ];

        setProducts(mockProducts);
      } catch (err) {
        console.error("Error loading new arrivals:", err);
        setError("Failed to load new arrivals. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
    // Reset to page 1 and hide mobile filters on mount
    setCurrentPage(1);
    setShowFilters(false);
  }, []);

  // Toggle filter sections
  const toggleFilter = (filter) => {
    setExpandedFilters({
      ...expandedFilters,
      [filter]: !expandedFilters[filter],
    });
  };

  // Toggle mobile filters visibility
  const toggleMobileFilters = () => {
    setShowFilters(!showFilters);
  };

  // Pagination
  const productsPerPage = 6;
  const pageCount = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
      if (pageTopRef.current) {
        pageTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    window.location.href = `/category/${newCategory}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" ref={pageTopRef}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-6">
          <a href="/" className="text-gray-500 hover:text-black">
            Home
          </a>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">New Arrivals</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle Button */}
          <button
            className="md:hidden flex items-center justify-center w-full py-3 px-4 mb-4 border border-gray-300 rounded-full font-medium text-sm"
            onClick={toggleMobileFilters}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-white p-4 overflow-y-auto md:hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-plak text-xl font-bold">Filters</h2>
                <button
                  onClick={toggleMobileFilters}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Filters Content */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Product Type</h3>
                <FilterItem label="T-shirts" hasChildren={true} />
                <FilterItem label="Shorts" hasChildren={true} />
                <FilterItem label="Shirts" hasChildren={true} />
                <FilterItem label="Hoodie" hasChildren={true} />
                <FilterItem label="Jeans" hasChildren={true} />
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <FilterHeader
                  label="Price"
                  isExpanded={expandedFilters.price}
                  onToggle={() => toggleFilter("price")}
                />
                {expandedFilters.price && (
                  <PriceRangeSlider
                    initialRange={priceRange}
                    onChange={setPriceRange}
                  />
                )}
              </div>

              {/* Colors Filter */}
              <div className="mb-6">
                <FilterHeader
                  label="Colors"
                  isExpanded={expandedFilters.colors}
                  onToggle={() => toggleFilter("colors")}
                />
                {expandedFilters.colors && (
                  <ColorFilters
                    selectedColors={selectedColors}
                    onChange={setSelectedColors}
                  />
                )}
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <FilterHeader
                  label="Size"
                  isExpanded={expandedFilters.size}
                  onToggle={() => toggleFilter("size")}
                />
                {expandedFilters.size && (
                  <SizeFilters
                    selectedSizes={selectedSizes}
                    onChange={setSelectedSizes}
                  />
                )}
              </div>

              {/* Dress Style Filter */}
              <div className="mb-6">
                <FilterHeader
                  label="Dress Style"
                  isExpanded={expandedFilters.dressStyle}
                  onToggle={() => toggleFilter("dressStyle")}
                />
                {expandedFilters.dressStyle && (
                  <CategoryFilters
                    currentCategory="New Arrivals"
                    onCategoryChange={handleCategoryChange}
                  />
                )}
              </div>

              {/* Apply Filter Button */}
              <div className="sticky bottom-0 pt-4 pb-6 bg-white">
                <button
                  className="w-full py-3 bg-black text-white rounded-full font-medium"
                  onClick={toggleMobileFilters}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}

          {/* Desktop Filters Section */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <button className="text-gray-400">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    d="M4 6h16M4 12h16m-7 6h7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Product Type Filter */}
            <div className="mb-6">
              <FilterItem label="T-shirts" hasChildren={true} />
              <FilterItem label="Shorts" hasChildren={true} />
              <FilterItem label="Shirts" hasChildren={true} />
              <FilterItem label="Hoodie" hasChildren={true} />
              <FilterItem label="Jeans" hasChildren={true} />
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <FilterHeader
                label="Price"
                isExpanded={expandedFilters.price}
                onToggle={() => toggleFilter("price")}
              />
              {expandedFilters.price && (
                <PriceRangeSlider
                  initialRange={priceRange}
                  onChange={setPriceRange}
                />
              )}
            </div>

            {/* Colors Filter */}
            <div className="mb-6">
              <FilterHeader
                label="Colors"
                isExpanded={expandedFilters.colors}
                onToggle={() => toggleFilter("colors")}
              />
              {expandedFilters.colors && (
                <ColorFilters
                  selectedColors={selectedColors}
                  onChange={setSelectedColors}
                />
              )}
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <FilterHeader
                label="Size"
                isExpanded={expandedFilters.size}
                onToggle={() => toggleFilter("size")}
              />
              {expandedFilters.size && (
                <SizeFilters
                  selectedSizes={selectedSizes}
                  onChange={setSelectedSizes}
                />
              )}
            </div>

            {/* Dress Style Filter */}
            <div className="mb-6">
              <FilterHeader
                label="Dress Style"
                isExpanded={expandedFilters.dressStyle}
                onToggle={() => toggleFilter("dressStyle")}
              />
              {expandedFilters.dressStyle && (
                <CategoryFilters
                  currentCategory="New Arrivals"
                  onCategoryChange={handleCategoryChange}
                />
              )}
            </div>

            {/* Apply Filter Button */}
            <button className="w-full py-3 bg-black text-white rounded-full font-medium">
              Apply Filter
            </button>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold mb-2 sm:mb-0">New Arrivals</h1>
              <div className="flex items-center text-sm">
                <span className="text-gray-500">
                  Showing {products.length > 0 ? 1 : 0}-
                  {paginatedProducts.length} of {products.length} Products
                </span>
                <div className="ml-4 flex items-center">
                  <span className="mr-2">Sort by:</span>
                  <div className="relative group">
                    <button className="flex items-center font-medium">
                      {sortBy}
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setSortBy("Most Popular")}
                        >
                          Most Popular
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setSortBy("Newest")}
                        >
                          Newest
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setSortBy("Price: Low to High")}
                        >
                          Price: Low to High
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setSortBy("Price: High to Low")}
                        >
                          Price: High to Low
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pageCount > 0 && (
              <div className="flex justify-between items-center mt-10">
                <button
                  className="flex items-center text-sm font-medium"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg
                    className="mr-1 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => (
                    <button
                      key={i}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === i + 1
                          ? "bg-black text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  {pageCount > 7 && (
                    <>
                      <span className="w-8 h-8 flex items-center justify-center">
                        ...
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                        onClick={() => handlePageChange(pageCount)}
                      >
                        {pageCount}
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="flex items-center text-sm font-medium"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pageCount}
                >
                  Next
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components for Filters
const FilterHeader = ({ label, isExpanded, onToggle }) => (
  <div
    className="flex justify-between items-center cursor-pointer"
    onClick={onToggle}
  >
    <h3 className="font-medium">{label}</h3>
    {isExpanded ? (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    )}
  </div>
);

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
    {hasChildren && (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    )}
  </div>
);

export default NewArrivals;
