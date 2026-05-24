import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Check, Calendar, ArrowLeft } from "lucide-react";
import { orderService } from "../../services/api";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If coming from Stripe, show generic success page without fetching order
  const isStripeSuccess = orderId === "stripe-success";

  useEffect(() => {
    window.scrollTo(0, 0);

    // Skip DB fetch for Stripe redirects — no order ID available
    if (isStripeSuccess) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await orderService.getOrder(orderId);
        const formattedOrder = {
          id: response._id,
          date: response.date,
          status: response.status || "confirmed",
          paymentStatus: response.paymentStatus || "paid",
          paymentMethod: response.paymentMethod || "Credit Card",
          shippingMethod: response.shippingMethod || "Standard Delivery",
          estimatedDelivery:
            response.estimatedDelivery ||
            new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          shippingAddress: {
            name: response.shippingAddress.name,
            streetAddress: response.shippingAddress.streetAddress,
            city: response.shippingAddress.city,
            state: response.shippingAddress.state,
            postalCode: response.shippingAddress.postalCode,
            country: response.shippingAddress.country,
          },
          billingAddress: {
            name: response.billingAddress.name,
            streetAddress: response.billingAddress.streetAddress,
            city: response.billingAddress.city,
            state: response.billingAddress.state,
            postalCode: response.billingAddress.postalCode,
            country: response.billingAddress.country,
          },
          items: response.items.map((item) => ({
            id: item.product || item._id,
            name: item.name,
            imageSrc: item.imageSrc || "/api/placeholder/120/120",
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
          subtotal: response.subtotal,
          shippingCost: response.shippingCost,
          discount: response.discount || 0,
          tax: response.tax || 0,
          total: response.total,
        };
        setOrderDetails(formattedOrder);
        setError(null);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message || "Failed to load order details");
        setOrderDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, isStripeSuccess]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleContinueShopping = () => navigate("/");
  const handleViewOrderDetails = () => navigate(`/profile/orders/${orderId}`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // ── Generic Stripe success page ──
  if (isStripeSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
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

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center bg-green-100 w-16 h-16 rounded-full mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <h1 className="font-plak text-3xl font-bold mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your payment was processed
              successfully.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Your order is being processed and you will receive a confirmation
              email shortly.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
            <div className="flex items-center justify-center text-green-600 mb-3">
              <Calendar size={18} className="mr-2" />
              <span className="font-medium">
                Estimated Delivery:{" "}
                {formatDate(
                  new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                )}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              You can track your order in the{" "}
              <Link to="/profile/orders" className="underline hover:text-black">
                Orders section
              </Link>{" "}
              of your account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContinueShopping}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </button>
            <Link
              to="/profile/orders"
              className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              View My Orders
            </Link>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email
              address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || "We couldn't find the order you're looking for."}
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

  // ── Normal order confirmation (Place Order flow) ──
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
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

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold">Order #{orderDetails.id}</h2>
            <span className="text-sm text-gray-500">
              {formatDate(orderDetails.date)}
            </span>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <h3 className="font-medium mb-3">Estimated Delivery</h3>
            <div className="flex items-center text-green-600">
              <Calendar size={18} className="mr-2" />
              <span>{formatDate(orderDetails.estimatedDelivery)}</span>
            </div>
          </div>

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
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>${orderDetails.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-red-500">
                  -${orderDetails.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>${orderDetails.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

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
                  Payment Status:{" "}
                  <span className="text-green-600">
                    {orderDetails.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

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
