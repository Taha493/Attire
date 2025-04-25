import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import { productService } from "../../services/api";
import { toast } from "react-hot-toast";

const NewArrivals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const newArrivalsData = await productService.getNewArrivals({
          limit: 4,
        });
        setProducts(newArrivalsData);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleViewAll = () => {
    navigate("/new-arrivals");
  };

  if (loading) {
    return (
      <section className="py-6 sm:py-8 md:py-10">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          NEW ARRIVALS
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6 sm:py-8 md:py-10">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          NEW ARRIVALS
        </h2>
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-6 sm:py-8 md:py-10">
        <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          NEW ARRIVALS
        </h2>
        <div className="text-center text-gray-500">
          No new products available at this time.
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8 md:py-10">
      <h2 className="font-plak text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        NEW ARRIVALS
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {location.pathname !== "/new-arrivals" && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            className="border border-gray-300 text-sm py-2 px-6 sm:px-8 rounded hover:bg-gray-50 transition-colors"
            onClick={handleViewAll}
          >
            View All
          </button>
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
