// src/components/checkout/CheckoutPage.js
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-4">
          <Link to="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <Link to="/cart" className="text-gray-500 hover:text-black">
            Cart
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">Checkout</span>
        </div>

        <h1 className="font-plak text-3xl font-bold mb-8">CHECKOUT</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Shipping and Payment Forms */}
          <div className="w-full lg:w-2/3">
            {/* Shipping Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium mb-1"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="border border-gray-300 rounded-md p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      className="mr-2"
                      defaultChecked
                    />
                    <label htmlFor="creditCard" className="font-medium">
                      Credit Card
                    </label>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium mb-1"
                      >
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="**** **** **** ****"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium mb-1"
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium mb-1"
                      >
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="***"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-md p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      className="mr-2"
                    />
                    <label htmlFor="paypal" className="font-medium">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">$565</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>Discount (20%)</span>
                <span>-$113</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium">$15</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>$467</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button className="w-full bg-black text-white py-3 rounded-full font-medium mt-6">
                Place Order
              </button>

              {/* Return to Cart Link */}
              <Link
                to="/cart"
                className="block text-center text-sm text-gray-500 hover:text-black mt-4"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
