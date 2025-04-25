// src/components/checkout/OrderConfirmationPage.js
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Check, Calendar, ArrowLeft } from "lucide-react";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // In a real app, you would fetch the order details from an API
    const fetchOrderDetails = async () => {
      setLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // This would be a real API call in production
        // const response = await fetch(`/api/orders/${orderId}`);
        // const data = await response.json();

        // Mock order data for demonstration
        const mockOrderData = {
          id: orderId || "ORD-" + Math.floor(100000 + Math.random() * 900000),
          date: new Date().toISOString(),
          status: "confirmed",
          paymentStatus: "paid",
          paymentMethod: "Credit Card",
          shippingMethod: "Standard Delivery",
          estimatedDelivery: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
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
          subtotal: 300,
          shippingCost: 15,
          discount: 60,
          tax: 24,
          total: 279,
        };

        setOrderDetails(mockOrderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
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

  // Continue shopping handler
  const handleContinueShopping = () => {
    navigate("/");
  };

  // View order details handler
  const handleViewOrderDetails = () => {
    navigate(`/profile/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn't find the order you're looking for. It may have been
            removed or the link is invalid.
          </p>
          <Link
            to="/"
            className="bg-black text-white px-6 py-3 rounded-full inline-block"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-4">
          <Link to="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <Link to="/checkout" className="text-gray-500 hover:text-black">
            Checkout
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">Order Confirmation</span>
        </div>

        {/* Order Success Message */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-green-100 w-16 h-16 rounded-full mb-4">
            <Check size={32} className="text-green-500" />
          </div>
          <h1 className="font-plak text-3xl font-bold mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold">Order #{orderDetails.id}</h2>
            <span className="text-sm text-gray-500">
              {formatDate(orderDetails.date)}
            </span>
          </div>

          {/* Delivery Timeline */}
          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <h3 className="font-medium mb-3">Estimated Delivery</h3>
            <div className="flex items-center text-green-600">
              <Calendar size={18} className="mr-2" />
              <span>{formatDate(orderDetails.estimatedDelivery)}</span>
            </div>
          </div>

          {/* Order Items */}
          <h3 className="font-medium mb-3">Items in Your Order</h3>
          <div className="space-y-4 mb-6">
            {orderDetails.items.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded mr-3">
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <div className="text-xs text-gray-500">
                    <span>Size: {item.size}</span>
                    <span className="mx-2">•</span>
                    <span>Color: {item.color}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Qty: {item.quantity} x ${item.price}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  ${item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${orderDetails.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>${orderDetails.shippingCost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-red-500">-${orderDetails.discount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>${orderDetails.tax}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${orderDetails.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-200 pt-4">
            <div>
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <address className="text-sm text-gray-600 not-italic">
                {orderDetails.shippingAddress.name}
                <br />
                {orderDetails.shippingAddress.streetAddress}
                <br />
                {orderDetails.shippingAddress.city},{" "}
                {orderDetails.shippingAddress.state}{" "}
                {orderDetails.shippingAddress.postalCode}
                <br />
                {orderDetails.shippingAddress.country}
              </address>
            </div>
            <div>
              <h3 className="font-medium mb-2">Payment Information</h3>
              <div className="text-sm text-gray-600">
                <p>Payment Method: {orderDetails.paymentMethod}</p>
                <p>
                  Payment Status: <span className="text-green-600">Paid</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleContinueShopping}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Continue Shopping
          </button>
          <button
            onClick={handleViewOrderDetails}
            className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            View Order Details
          </button>
        </div>

        {/* Order Status Tracking */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your registered email address.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            You can track your order status in the{" "}
            <Link to="/profile/orders" className="underline">
              Orders section
            </Link>{" "}
            of your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
