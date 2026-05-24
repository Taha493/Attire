import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cartService, userService, orderService } from "../../services/api";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [newAddress, setNewAddress] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });
  const [newPayment, setNewPayment] = useState({
    type: "credit",
    cardBrand: "",
    lastFour: "",
    expiryMonth: "",
    expiryYear: "",
    isDefault: false,
  });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [useNewPayment, setUseNewPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountPercentage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cartResponse, addressResponse, paymentResponse] =
          await Promise.all([
            cartService.getCart(),
            userService.getAddresses(),
            userService.getPaymentMethods(),
          ]);

        const formattedItems = cartResponse.items.map((item) => ({
          id: item._id,
          productId: item.product._id,
          name: item.product.name,
          price: item.price,
          imageSrc: item.product.imageSrc,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        }));
        setCartItems(formattedItems);

        setAddresses(addressResponse);
        const defaultAddress = addressResponse.find((addr) => addr.isDefault);
        if (defaultAddress) setSelectedAddress(defaultAddress._id);

        setPaymentMethods(paymentResponse);
        const defaultPayment = paymentResponse.find(
          (method) => method.isDefault,
        );
        if (defaultPayment) setSelectedPaymentMethod(defaultPayment._id);

        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const discount = promoApplied
    ? Math.round((subtotal * discountPercentage) / 100)
    : 0;
  const deliveryFee = 15;
  const tax = 0;
  const total = subtotal - discount + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      let shippingAddress;
      let paymentMethodData;

      if (useNewAddress) {
        const response = await userService.addAddress(newAddress);
        shippingAddress = response.find(
          (addr) => addr.streetAddress === newAddress.streetAddress,
        );
      } else {
        shippingAddress = addresses.find(
          (addr) => addr._id === selectedAddress,
        );
      }

      if (useNewPayment) {
        if (newPayment.type === "credit") {
          const response = await userService.addPaymentMethod(newPayment);
          paymentMethodData = response.find(
            (method) => method.lastFour === newPayment.lastFour,
          );
        } else {
          paymentMethodData = { type: "paypal" };
        }
      } else {
        paymentMethodData = paymentMethods.find(
          (method) => method._id === selectedPaymentMethod,
        ) || { type: "paypal" };
      }

      if (!shippingAddress)
        throw new Error("Please select or add a shipping address");
      if (!paymentMethodData)
        throw new Error("Please select or add a payment method");

      const orderData = {
        items: cartItems.map((item) => ({
          product: item.productId,
          name: item.name,
          imageSrc: item.imageSrc,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        subtotal,
        shippingCost: deliveryFee,
        discount,
        tax,
        total,
        shippingAddress: {
          name: shippingAddress.name,
          streetAddress: shippingAddress.streetAddress,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        billingAddress: shippingAddress,
        paymentMethod: paymentMethodData.type,
      };

      const createdOrder = await orderService.createOrder(orderData);
      await cartService.clearCart();
      navigate(`/order-confirmation/${createdOrder._id}`);
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
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

        {loading && <div className="text-center py-4">Loading...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            {/* Shipping Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Select Saved Address
                </label>
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  disabled={useNewAddress || loading}
                >
                  <option value="">Select an address</option>
                  {addresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.name}: {addr.streetAddress}, {addr.city}
                    </option>
                  ))}
                </select>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={useNewAddress}
                    onChange={() => setUseNewAddress(!useNewAddress)}
                    className="mr-2"
                    disabled={loading}
                  />
                  Use a new address
                </label>
              </div>

              {useNewAddress && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Address Name (e.g., Home)
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newAddress.name}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      disabled={loading}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="streetAddress"
                      className="block text-sm font-medium mb-1"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={newAddress.streetAddress}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      disabled={loading}
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
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium mb-1"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={newAddress.state}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      disabled={loading}
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
                      name="postalCode"
                      value={newAddress.postalCode}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium mb-1"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={newAddress.country}
                      onChange={handleAddressChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      disabled={loading}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={newAddress.isDefault}
                        onChange={() =>
                          setNewAddress((prev) => ({
                            ...prev,
                            isDefault: !prev.isDefault,
                          }))
                        }
                        className="mr-2"
                        disabled={loading}
                      />
                      Set as default address
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Select Saved Payment Method
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  disabled={useNewPayment || loading}
                >
                  <option value="">Select a payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method._id} value={method._id}>
                      {method.type === "credit"
                        ? `${method.cardBrand} ending in ${method.lastFour}`
                        : "PayPal"}
                    </option>
                  ))}
                </select>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={useNewPayment}
                    onChange={() => setUseNewPayment(!useNewPayment)}
                    className="mr-2"
                    disabled={loading}
                  />
                  Add a new payment method
                </label>
              </div>

              {useNewPayment && (
                <div className="space-y-4">
                  <div className="border border-gray-300 rounded-md p-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="creditCard"
                        name="paymentType"
                        value="credit"
                        checked={newPayment.type === "credit"}
                        onChange={() =>
                          setNewPayment((prev) => ({ ...prev, type: "credit" }))
                        }
                        className="mr-2"
                        disabled={loading}
                      />
                      <label htmlFor="creditCard" className="font-medium">
                        Credit Card
                      </label>
                    </div>
                    {newPayment.type === "credit" && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="cardBrand"
                            className="block text-sm font-medium mb-1"
                          >
                            Card Brand (e.g., Visa, MasterCard)
                          </label>
                          <input
                            type="text"
                            id="cardBrand"
                            name="cardBrand"
                            value={newPayment.cardBrand}
                            onChange={handlePaymentChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            disabled={loading}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="lastFour"
                            className="block text-sm font-medium mb-1"
                          >
                            Last Four Digits
                          </label>
                          <input
                            type="text"
                            id="lastFour"
                            name="lastFour"
                            value={newPayment.lastFour}
                            onChange={handlePaymentChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="****"
                            maxLength="4"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="expiryMonth"
                            className="block text-sm font-medium mb-1"
                          >
                            Expiry Month
                          </label>
                          <input
                            type="text"
                            id="expiryMonth"
                            name="expiryMonth"
                            value={newPayment.expiryMonth}
                            onChange={handlePaymentChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="MM"
                            maxLength="2"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="expiryYear"
                            className="block text-sm font-medium mb-1"
                          >
                            Expiry Year
                          </label>
                          <input
                            type="text"
                            id="expiryYear"
                            name="expiryYear"
                            value={newPayment.expiryYear}
                            onChange={handlePaymentChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="YYYY"
                            maxLength="4"
                            disabled={loading}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="isDefault"
                              checked={newPayment.isDefault}
                              onChange={() =>
                                setNewPayment((prev) => ({
                                  ...prev,
                                  isDefault: !prev.isDefault,
                                }))
                              }
                              className="mr-2"
                              disabled={loading}
                            />
                            Set as default payment method
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-300 rounded-md p-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentType"
                        value="paypal"
                        checked={newPayment.type === "paypal"}
                        onChange={() =>
                          setNewPayment((prev) => ({ ...prev, type: "paypal" }))
                        }
                        className="mr-2"
                        disabled={loading}
                      />
                      <label htmlFor="paypal" className="font-medium">
                        PayPal
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>Discount ({promoApplied ? discountPercentage : 0}%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium">${deliveryFee.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="w-full bg-black text-white py-3 rounded-full font-medium mt-6"
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
              >
                Place Order
              </button>

              <div className="mt-3">
                <StripeCheckoutButton cartItems={cartItems} />
              </div>

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

// Stripe Checkout Button Component
const StripeCheckoutButton = ({ cartItems }) => {
  const handleCheckout = async () => {
    const apiBase = (
      process.env.REACT_APP_API_URL || "http://localhost:5000/api"
    ).replace("/api", "");

    const res = await fetch(`${apiBase}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems,
        successUrl: `${window.location.origin}/order-confirmation/stripe-success`,
        cancelUrl: `${window.location.origin}/checkout`,
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-blue-600 text-white py-3 rounded-full font-medium"
      disabled={!cartItems.length}
    >
      Pay with Stripe
    </button>
  );
};

export default CheckoutPage;
