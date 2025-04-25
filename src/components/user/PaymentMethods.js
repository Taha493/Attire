import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, Check } from "lucide-react";
import { toast } from "react-hot-toast";
// import { userService } from "../../services/api";

const PaymentMethods = () => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    isDefault: false,
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payment methods on component mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        // const methods = await userService.getPaymentMethods();
        // setPaymentMethods(methods);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        toast.error("Failed to load payment methods");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Handle form change
  const handleCardFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardForm({
      ...cardForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  // Handle card number input with formatting
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    setCardForm({
      ...cardForm,
      cardNumber: formatCardNumber(value),
    });
  };

  // Handle expiry date change
  const handleExpiryChange = (e, type) => {
    let value = e.target.value.replace(/[^\d]/g, "");

    if (type === "month") {
      if (value.length > 2) value = value.slice(0, 2);
      if (parseInt(value) > 12) value = "12";
    } else {
      if (value.length > 2) value = value.slice(0, 2);
      const currentYear = new Date().getFullYear() % 100;
      if (value && parseInt(value) < currentYear)
        value = currentYear.toString();
    }

    setCardForm({
      ...cardForm,
      [type === "month" ? "expiryMonth" : "expiryYear"]: value,
    });
  };

  // Handle CVV change
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    setCardForm({
      ...cardForm,
      cvv: value,
    });
  };

  // Handle card form submission
  const handleAddCardSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (cardForm.cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Please enter a valid card number");
      return;
    }

    if (!cardForm.cardholderName) {
      toast.error("Please enter the cardholder name");
      return;
    }

    if (!cardForm.expiryMonth || !cardForm.expiryYear) {
      toast.error("Please enter a valid expiry date");
      return;
    }

    if (!cardForm.cvv) {
      toast.error("Please enter the security code (CVV)");
      return;
    }

    try {
      // Determine card brand from first digit
      let cardBrand = "Unknown";
      const firstDigit = cardForm.cardNumber.charAt(0);
      if (firstDigit === "4") cardBrand = "Visa";
      else if (firstDigit === "5") cardBrand = "Mastercard";
      else if (firstDigit === "3") cardBrand = "Amex";
      else if (firstDigit === "6") cardBrand = "Discover";

      // Format payment data for API
      const paymentData = {
        type: "credit", // Default to credit card
        cardBrand,
        lastFour: cardForm.cardNumber.replace(/\s/g, "").slice(-4),
        expiryMonth: parseInt(cardForm.expiryMonth),
        expiryYear: parseInt(cardForm.expiryYear),
        isDefault: cardForm.isDefault,
      };

      // Add payment method
      // const updatedMethods = await userService.addPaymentMethod(paymentData);
      // setPaymentMethods(updatedMethods);

      // Success message and reset form
      toast.success("Payment method added successfully");
      setIsAddingCard(false);
      setCardForm({
        cardNumber: "",
        cardholderName: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error(error.message || "Failed to add payment method");
    }
  };

  // Set a payment method as default
  const setDefaultPaymentMethod = async (paymentId) => {
    try {
      // const updatedMethods = await userService.setDefaultPaymentMethod(
      //   paymentId
      // );
      // setPaymentMethods(updatedMethods);
      toast.success("Default payment method updated");
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast.error(error.message || "Failed to update default payment method");
    }
  };

  // Delete a payment method
  const deletePaymentMethod = async (paymentId) => {
    try {
      // const updatedMethods = await userService.deletePaymentMethod(paymentId);
      // setPaymentMethods(updatedMethods);
      toast.success("Payment method removed");
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error(error.message || "Failed to remove payment method");
    }
  };

  // Get card icon based on card brand
  const getCardIcon = (brand) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return (
          <div className="w-8 h-6 bg-blue-700 rounded text-white flex items-center justify-center text-xs font-bold">
            VISA
          </div>
        );
      case "mastercard":
        return (
          <div className="w-8 h-6 bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold">
            MC
          </div>
        );
      case "amex":
        return (
          <div className="w-8 h-6 bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold">
            AMEX
          </div>
        );
      case "discover":
        return (
          <div className="w-8 h-6 bg-orange-500 rounded text-white flex items-center justify-center text-xs font-bold">
            DISC
          </div>
        );
      default:
        return (
          <div className="w-8 h-6 bg-gray-700 rounded text-white flex items-center justify-center text-xs">
            CARD
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <button
          className="flex items-center text-sm bg-black text-white px-3 py-2 rounded-md"
          onClick={() => setIsAddingCard(true)}
        >
          <Plus size={16} className="mr-1" />
          Add New Card
        </button>
      </div>

      {isAddingCard ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Add New Payment Method</h2>
            <button
              className="text-sm text-gray-600"
              onClick={() => setIsAddingCard(false)}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddCardSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={cardForm.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                maxLength={19} // 16 digits + 3 spaces
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={cardForm.cardholderName}
                onChange={handleCardFormChange}
                placeholder="John Smith"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="expiryMonth"
                    value={cardForm.expiryMonth}
                    onChange={(e) => handleExpiryChange(e, "month")}
                    placeholder="MM"
                    className="w-16 px-4 py-2 border border-gray-300 rounded-md text-center"
                    maxLength={2}
                    required
                  />
                  <span className="flex items-center">/</span>
                  <input
                    type="text"
                    name="expiryYear"
                    value={cardForm.expiryYear}
                    onChange={(e) => handleExpiryChange(e, "year")}
                    placeholder="YY"
                    className="w-16 px-4 py-2 border border-gray-300 rounded-md text-center"
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Security Code (CVV)
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardForm.cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={cardForm.isDefault}
                  onChange={handleCardFormChange}
                  className="mr-2"
                />
                <span className="text-sm">Set as default payment method</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md"
            >
              Add Payment Method
            </button>
          </form>
        </div>
      ) : null}

      {/* Payment Methods List */}
      {paymentMethods && paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-lg border ${
                method.isDefault ? "border-black" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  {getCardIcon(method.cardBrand)}
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">
                        {method.cardBrand}
                      </span>
                      <span className="text-sm">•••• {method.lastFour}</span>
                      {method.isDefault && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <>
                      <button
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className="p-2 rounded-full hover:bg-gray-100"
                        title="Set as default"
                      >
                        <Check size={16} />
                      </button>

                      {showDeleteConfirm === method.id ? (
                        <div className="flex items-center space-x-2 bg-red-50 px-2 py-1 rounded">
                          <span className="text-xs">Delete?</span>
                          <button
                            className="text-xs text-red-500 font-medium"
                            onClick={() => deletePaymentMethod(method.id)}
                          >
                            Yes
                          </button>
                          <button
                            className="text-xs"
                            onClick={() => setShowDeleteConfirm(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(method.id)}
                          className="p-2 rounded-full hover:bg-gray-100 text-red-500"
                          title="Remove card"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center bg-gray-100 w-16 h-16 rounded-full mb-4">
            <CreditCard size={24} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-medium mb-2">No payment methods saved</h2>
          <p className="text-gray-500 mb-4">
            Add a payment method to make checkout easier.
          </p>
          <button
            className="bg-black text-white px-6 py-2 rounded-full"
            onClick={() => setIsAddingCard(true)}
          >
            Add Payment Method
          </button>
        </div>
      )}

      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium mb-2">Security Notice</h3>
        <p className="text-xs text-gray-500">
          Your payment information is encrypted and securely stored. We use
          industry-standard security measures to protect your data and never
          store your full card details on our servers.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;
