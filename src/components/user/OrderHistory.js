// src/components/user/OrderHistory.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // This would be a real API call in production
        // const response = await fetch('/api/user/orders');
        // const data = await response.json();

        // Mock order data
        const mockOrders = [
          {
            id: "ORD-123456",
            date: "2025-03-15T10:30:00Z",
            total: 279.99,
            status: "delivered",
            paymentStatus: "paid",
            items: [
              {
                id: "t-shirt-tape-details",
                name: "T-shirt with Tape Details",
                imageSrc: "/api/placeholder/80/80",
                price: 120,
                quantity: 1,
                variant: "Black / Large",
              },
              {
                id: "checkered-shirt",
                name: "Checkered Shirt",
                imageSrc: "/api/placeholder/80/80",
                price: 180,
                quantity: 1,
                variant: "Blue / Medium",
              },
            ],
            shippingMethod: "Standard Shipping",
            trackingNumber: "TRK12345678",
          },
          {
            id: "ORD-789012",
            date: "2025-03-01T14:20:00Z",
            total: 145.0,
            status: "delivered",
            paymentStatus: "paid",
            items: [
              {
                id: "courage-graphic-tshirt",
                name: "Courage Graphic T-shirt",
                imageSrc: "/api/placeholder/80/80",
                price: 145,
                quantity: 1,
                variant: "White / Medium",
              },
            ],
            shippingMethod: "Express Shipping",
            trackingNumber: "TRK98765432",
          },
          {
            id: "ORD-345678",
            date: "2025-04-10T09:15:00Z",
            total: 324.5,
            status: "processing",
            paymentStatus: "paid",
            items: [
              {
                id: "vertical-striped-shirt",
                name: "Vertical Striped Shirt",
                imageSrc: "/api/placeholder/80/80",
                price: 212,
                quantity: 1,
                variant: "Green / Large",
              },
              {
                id: "loose-fit-bermuda-shorts",
                name: "Loose Fit Bermuda Shorts",
                imageSrc: "/api/placeholder/80/80",
                price: 80,
                quantity: 1,
                variant: "Beige / Large",
              },
            ],
            shippingMethod: "Standard Shipping",
            trackingNumber: null,
          },
          {
            id: "ORD-456789",
            date: "2025-04-18T16:45:00Z",
            total: 210.0,
            status: "shipped",
            paymentStatus: "paid",
            items: [
              {
                id: "faded-skinny-jeans",
                name: "Faded Skinny Jeans",
                imageSrc: "/api/placeholder/80/80",
                price: 210,
                quantity: 1,
                variant: "Blue / Medium",
              },
            ],
            shippingMethod: "Express Shipping",
            trackingNumber: "TRK45678901",
          },
        ];

        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Filter orders based on status
  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((order) => order.status === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-600";
      case "shipped":
        return "bg-blue-100 text-blue-600";
      case "processing":
        return "bg-yellow-100 text-yellow-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Get formatted status text
  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "all" ? "bg-black text-white" : "bg-gray-100"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "processing" ? "bg-black text-white" : "bg-gray-100"
            }`}
            onClick={() => setFilter("processing")}
          >
            Processing
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "shipped" ? "bg-black text-white" : "bg-gray-100"
            }`}
            onClick={() => setFilter("shipped")}
          >
            Shipped
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "delivered" ? "bg-black text-white" : "bg-gray-100"
            }`}
            onClick={() => setFilter("delivered")}
          >
            Delivered
          </button>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-9 pr-3 py-2 bg-gray-100 rounded-full w-full sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div>
                    <span className="text-sm font-medium">Order #:</span>
                    <span className="ml-1 text-sm">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Date:</span>
                    <span className="ml-1 text-sm">
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Total:</span>
                    <span className="ml-1 text-sm">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mt-2 sm:mt-0 gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>

                  <Link
                    to={`/profile/orders/${order.id}`}
                    className="flex items-center text-sm text-black"
                  >
                    Details
                    <ChevronRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-4 py-3">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${order.id}-${item.id}-${index}`}
                      className="flex items-center"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded mr-3">
                        <img
                          src={item.imageSrc}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <div className="text-xs text-gray-500">
                          {item.variant} • Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Info */}
                {order.status !== "processing" &&
                  order.status !== "cancelled" && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>Shipping: {order.shippingMethod}</span>
                        {order.trackingNumber && (
                          // eslint-disable-next-line jsx-a11y/anchor-is-valid
                          <a href="#" className="text-black underline">
                            Track Package ({order.trackingNumber})
                          </a>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-gray-500 mb-2">No orders found</div>
          <p className="text-sm text-gray-400">
            {filter !== "all" || searchQuery
              ? "Try changing your filters or search terms"
              : "Your order history will appear here once you make a purchase"}
          </p>
          {(filter !== "all" || searchQuery) && (
            <button
              className="mt-4 underline text-black"
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
