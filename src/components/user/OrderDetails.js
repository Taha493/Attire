// src/components/user/OrderDetails.js
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Truck,
  Package,
  Calendar,
  Download,
  Phone,
  Mail,
} from "lucide-react";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      setLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        // This would be a real API call in production
        // const response = await fetch(`/api/orders/${orderId}`);
        // const data = await response.json();

        // Mock order data
        const mockOrder = {
          id: orderId,
          date: "2025-03-15T10:30:00Z",
          total: 279.99,
          status: "delivered",
          paymentStatus: "paid",
          estimatedDelivery: "2025-03-20T00:00:00Z",
          deliveredDate: "2025-03-19T14:35:00Z",
          shippingMethod: "Standard Shipping",
          shippingCost: 15,
          discount: 40,
          tax: 25.99,
          subtotal: 279,
          items: [
            {
              id: "t-shirt-tape-details",
              name: "T-shirt with Tape Details",
              imageSrc: "/api/placeholder/120/120",
              price: 120,
              quantity: 1,
              size: "Large",
              color: "Black",
            },
            {
              id: "checkered-shirt",
              name: "Checkered Shirt",
              imageSrc: "/api/placeholder/120/120",
              price: 180,
              quantity: 1,
              size: "Medium",
              color: "Blue",
            },
          ],
          trackingNumber: "TRK12345678",
          trackingURL: "#",
          shippingAddress: {
            name: "John Doe",
            streetAddress: "123 Main Street",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "United States",
          },
          billingAddress: {
            name: "John Doe",
            streetAddress: "123 Main Street",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "United States",
          },
          paymentMethod: "Credit Card (Visa ****4242)",
        };

        setOrder(mockOrder);
      } catch (error) {
        console.error(
          `Error fetching order details for order ${orderId}:`,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
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

  // Navigate back to orders
  const goBackToOrders = () => {
    navigate("/profile/orders");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-4">
          The order you're looking for doesn't exist or might have been removed.
        </p>
        <button
          onClick={goBackToOrders}
          className="flex items-center text-black underline mx-auto"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={goBackToOrders}
          className="flex items-center text-black"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Orders
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Order #{order.id}</h1>

      {/* Order Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                {formatDate(order.date)}
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1">
              Thank you for your order!
            </h2>
          </div>
          <button
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            onClick={() => window.print()}
          >
            <Download size={16} className="mr-1" />
            Download Invoice
          </button>
        </div>

        {/* Delivery Timeline */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-medium mb-3">Order Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Package size={18} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium">Order Placed</div>
                <div className="text-xs text-gray-500">
                  {formatDateTime(order.date)}
                </div>
              </div>
            </div>

            {(order.status === "shipped" || order.status === "delivered") && (
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Truck size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Shipped</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(
                      new Date(new Date(order.date).getTime() + 86400000)
                    )}
                  </div>
                </div>
              </div>
            )}

            {order.status === "delivered" && (
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <Calendar size={18} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Delivered</div>
                  <div className="text-xs text-gray-500">
                    {formatDateTime(order.deliveredDate)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tracking Information */}
        {(order.status === "shipped" || order.status === "delivered") &&
          order.trackingNumber && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium mb-2">Tracking Information</h3>
              <div className="text-sm">
                <p>
                  Tracking Number:{" "}
                  <span className="font-medium">{order.trackingNumber}</span>
                </p>
                <p className="mt-1">Shipping Method: {order.shippingMethod}</p>
                <a
                  href={order.trackingURL}
                  className="inline-block mt-2 text-black underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Track your package
                </a>
              </div>
            </div>
          )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-md mr-4">
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <Link
                  to={`/product/${item.id}`}
                  className="font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <div className="text-sm text-gray-500 mt-1">
                  <span>Size: {item.size}</span>
                  <span className="mx-2">•</span>
                  <span>Color: {item.color}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${item.price.toFixed(2)}</div>
                <div className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment & Shipping Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-4">Shipping & Payment</h2>

          <div className="mb-4">
            <h3 className="font-medium text-sm mb-2">Shipping Address</h3>
            <address className="text-sm text-gray-600 not-italic">
              {order.shippingAddress.name}
              <br />
              {order.shippingAddress.streetAddress}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-sm mb-2">Billing Address</h3>
            <address className="text-sm text-gray-600 not-italic">
              {order.billingAddress.name}
              <br />
              {order.billingAddress.streetAddress}
              <br />
              {order.billingAddress.city}, {order.billingAddress.state}{" "}
              {order.billingAddress.postalCode}
              <br />
              {order.billingAddress.country}
            </address>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-2">Payment Method</h3>
            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
            <p className="text-sm text-gray-600 mt-1">
              Payment Status: <span className="text-green-600">Paid</span>
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-red-500">
                  -${order.discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-bold mb-4">Need Help?</h2>
        <p className="text-sm text-gray-600 mb-4">
          If you have any questions or issues with your order, please contact
          our customer support team.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Phone size={18} className="text-gray-400 mr-2" />
            <span className="text-sm">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <Mail size={18} className="text-gray-400 mr-2" />
            <span className="text-sm">support@attire.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
