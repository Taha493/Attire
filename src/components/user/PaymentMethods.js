import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { userService } from "../../services/api";

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
  const [cardBrand, setCardBrand] = useState("");
  const [isCardValid, setIsCardValid] = useState(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await userService.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        toast.error("Failed to load payment methods");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const validateCardNumber = (number) => {
    const digits = number.replace(/\s/g, "").split("").map(Number);
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const detectCardBrand = (number) => {
    const cleanNumber = number.replace(/\s/g, "");
    if (!cleanNumber) return "";

    if (/^4/.test(cleanNumber)) return "Visa";
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    if (/^3[47]/.test(cleanNumber)) return "Amex";
    if (/^6(?:011|5)/.test(cleanNumber)) return "Discover";
    if (/^35(?:2[89]|[3-8])/.test(cleanNumber)) return "JCB";
    if (/^62/.test(cleanNumber)) return "UnionPay";
    return "Unknown";
  };

  const handleCardFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardForm({
      ...cardForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    const formattedValue = formatCardNumber(value);
    setCardForm({
      ...cardForm,
      cardNumber: formattedValue,
    });

    const isValid = validateCardNumber(value);
    setIsCardValid(value.length >= 13 ? isValid : null);
    setCardBrand(detectCardBrand(value));
  };

  const handleExpiryChange = (e, type) => {
    let value = e.target.value.replace(/[^\d]/g, "");

    if (type === "month") {
      if (value.length > 2) value = value.slice(0, 2);
      if (value && parseInt(value) > 12) value = "12";
    } else {
      if (value.length > 2) value = value.slice(0, 2);
      // Only validate if the user has entered a complete two-digit year
      if (value.length === 2) {
        const currentYear = new Date().getFullYear() % 100;
        if (parseInt(value) < currentYear) value = currentYear.toString();
      }
    }

    setCardForm({
      ...cardForm,
      [type === "month" ? "expiryMonth" : "expiryYear"]: value,
    });
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    setCardForm({
      ...cardForm,
      cvv: value,
    });
  };

  const handleAddCardSubmit = async (e) => {
    e.preventDefault();

    const cleanCardNumber = cardForm.cardNumber.replace(/\s/g, "");
    if (!isCardValid || cleanCardNumber.length < 13) {
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
      const paymentData = {
        type: "credit",
        cardBrand: cardBrand || "Unknown",
        lastFour: cleanCardNumber.slice(-4),
        expiryMonth: parseInt(cardForm.expiryMonth),
        expiryYear: parseInt(cardForm.expiryYear),
        isDefault: cardForm.isDefault,
      };

      const updatedMethods = await userService.addPaymentMethod(paymentData);
      setPaymentMethods(updatedMethods);

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
      setCardBrand("");
      setIsCardValid(null);
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error(error.message || "Failed to add payment method");
    }
  };

  const setDefaultPaymentMethod = async (paymentId) => {
    try {
      const updatedMethods = await userService.setDefaultPaymentMethod(
        paymentId
      );
      setPaymentMethods(updatedMethods);
      toast.success("Default payment method updated");
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast.error(error.message || "Failed to update default payment method");
    }
  };

  const deletePaymentMethod = async (paymentId) => {
    try {
      const updatedMethods = await userService.deletePaymentMethod(paymentId);
      setPaymentMethods(updatedMethods);
      toast.success("Payment method removed");
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error(error.message || "Failed to remove payment method");
    }
  };

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
      case "jcb":
        return (
          <div className="w-8 h-6 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold">
            JCB
          </div>
        );
      case "unionpay":
        return (
          <div className="w-8 h-6 bg-gray-600 rounded text-white flex items-center justify-center text-xs font-bold">
            UP
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
              onClick={() => {
                setIsAddingCard(false);
                setCardBrand("");
                setIsCardValid(null);
              }}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddCardSubmit}>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={cardForm.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-2 border rounded-md pr-12 ${
                    isCardValid === false
                      ? "border-red-500"
                      : isCardValid
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                  maxLength={19}
                  required
                />
                {cardBrand && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {getCardIcon(cardBrand)}
                  </div>
                )}
              </div>
              {isCardValid === false && (
                <p className="text-red-500 text-xs mt-1">Invalid card number</p>
              )}
              {isCardValid === true && (
                <p className="text-green-500 text-xs mt-1">
                  Valid {cardBrand} card
                </p>
              )}
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
              disabled={isCardValid === false}
            >
              Add Payment Method
            </button>
          </form>
        </div>
      ) : null}

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
                        onClick={() => setDefaultPaymentMethod(method._id)}
                        className="p-2 rounded-full hover:bg-gray-100"
                        title="Set as default"
                      >
                        <Check size={16} />
                      </button>

                      {showDeleteConfirm === method._id ? (
                        <div className="flex items-center space-x-2 bg-red-50 px-2 py-1 rounded">
                          <span className="text-xs">Delete?</span>
                          <button
                            className="text-xs text-red-500 font-medium"
                            onClick={() => deletePaymentMethod(method._id)}
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
                          onClick={() => setShowDeleteConfirm(method._id)}
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
