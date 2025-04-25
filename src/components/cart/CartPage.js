// src/components/cart/CartPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Trash2, Minus, Plus } from "lucide-react";

const CartPage = () => {
  // State for cart items and quantities
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      size: "Large",
      color: "White",
      price: 145,
      quantity: 1,
      imageSrc: "/api/placeholder/120/120", // Replace with actual image path
    },
    {
      id: 2,
      name: "Checkered Shirt",
      size: "Medium",
      color: "Red",
      price: 180,
      quantity: 1,
      imageSrc: "/api/placeholder/120/120", // Replace with actual image path
    },
    {
      id: 3,
      name: "Skinny Fit Jeans",
      size: "Large",
      color: "Blue",
      price: 240,
      quantity: 1,
      imageSrc: "/api/placeholder/120/120", // Replace with actual image path
    },
  ]);

  const [promoCode, setPromoCode] = useState("");

  // Update quantity of an item
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Discount calculation - 20% of subtotal
  const discountPercentage = 20;
  const discount = Math.round((subtotal * discountPercentage) / 100);

  // Delivery fee
  const deliveryFee = 15;

  // Total amount
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-4">
          <Link to="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">Cart</span>
        </div>

        <h1 className="font-plak text-3xl font-bold mb-8">YOUR CART</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-t border-gray-200 relative"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 sm:mr-4 mb-4 sm:mb-0 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.imageSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <div>Size: {item.size}</div>
                      <div>Color: {item.color}</div>
                    </div>
                    <div className="font-bold mt-2">${item.price}</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-4 sm:mt-0">
                    <button
                      className="bg-gray-100 p-2 rounded-full"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="mx-3 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="bg-gray-100 p-2 rounded-full"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="absolute top-4 right-0 text-red-500"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link to="/dashboard">
                  <button className="bg-black text-white px-6 py-2 rounded-full">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal}</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>Discount ({discountPercentage}%)</span>
                <span>-${discount}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium">${deliveryFee}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="mt-6">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Add promo code"
                    className="flex-1 border border-gray-300 rounded-l p-2 text-sm focus:outline-none"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button className="bg-black text-white px-4 py-2 rounded-r text-sm">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout" className="block mt-6">
                <button className="w-full bg-black text-white py-3 rounded-full font-medium flex items-center justify-center">
                  Go to Checkout
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
