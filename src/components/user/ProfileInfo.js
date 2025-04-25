// src/components/user/ProfileInfo.js - Updated version with API integration
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Pencil, Plus, X } from "lucide-react";
import { userService } from "../../services/api";

const ProfileInfo = ({ user, refreshUser }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [addressForm, setAddressForm] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState({
    profile: false,
    address: false,
    deleteAddress: false,
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Handle profile edit
  const handleEditProfile = () => {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditingProfile(true);
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });

    try {
      await userService.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
      });

      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);

      // Refresh user data
      if (refreshUser) refreshUser();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  // Handle address edit
  const handleEditAddress = (address) => {
    setAddressForm({
      name: address.name,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingAddressId(address._id);
    setIsEditingAddress(true);
  };

  // Handle add new address
  const handleAddAddress = () => {
    setAddressForm({
      name: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
    setEditingAddressId(null);
    setIsEditingAddress(true);
  };

  // Handle address form changes
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle address form submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, address: true });

    try {
      if (editingAddressId) {
        // Update existing address
        await userService.updateAddress(editingAddressId, addressForm);
        toast.success("Address updated successfully!");
      } else {
        // Add new address
        await userService.addAddress(addressForm);
        toast.success("Address added successfully!");
      }

      setIsEditingAddress(false);
      setEditingAddressId(null);

      // Refresh user data
      if (refreshUser) refreshUser();
    } catch (error) {
      console.error("Address submit error:", error);
      toast.error(error.message || "Failed to save address");
    } finally {
      setLoading({ ...loading, address: false });
    }
  };

  // Handle address delete
  const handleDeleteAddress = async (addressId) => {
    setLoading({ ...loading, deleteAddress: addressId });

    try {
      await userService.deleteAddress(addressId);
      toast.success("Address deleted successfully!");

      // Refresh user data
      if (refreshUser) refreshUser();
    } catch (error) {
      console.error("Address delete error:", error);
      toast.error(error.message || "Failed to delete address");
    } finally {
      setLoading({ ...loading, deleteAddress: false });
    }
  };

  // Handle set default address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      await userService.setDefaultAddress(addressId);
      toast.success("Default address updated!");

      // Refresh user data
      if (refreshUser) refreshUser();
    } catch (error) {
      console.error("Set default address error:", error);
      toast.error(error.message || "Failed to update default address");
    }
  };

  // Handle cancel form editing
  const handleCancel = (formType) => {
    if (formType === "profile") {
      setIsEditingProfile(false);
    } else if (formType === "address") {
      setIsEditingAddress(false);
      setEditingAddressId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile Information</h1>

      {/* Profile Details Section */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Personal Information</h2>
          {!isEditingProfile && (
            <button
              onClick={handleEditProfile}
              className="text-sm flex items-center text-gray-600 hover:text-black"
            >
              <Pencil size={14} className="mr-1" />
              Edit
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  To update your email address, please go to Account Settings.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md flex items-center"
                disabled={loading.profile}
              >
                {loading.profile ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={() => handleCancel("profile")}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm font-medium">Full Name</span>
              <span className="text-sm">{user?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm font-medium">Email Address</span>
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm font-medium">Phone Number</span>
              <span className="text-sm">{user?.phone || "Not provided"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm">
                {user?.created ? formatDate(user.created) : "N/A"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Shipping Addresses Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Shipping Addresses</h2>
          {!isEditingAddress && (
            <button
              onClick={handleAddAddress}
              className="text-sm flex items-center text-gray-600 hover:text-black"
            >
              <Plus size={14} className="mr-1" />
              Add New Address
            </button>
          )}
        </div>

        {isEditingAddress ? (
          <form
            onSubmit={handleAddressSubmit}
            className="mb-4 border-b border-gray-200 pb-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Home, Work, etc."
                  value={addressForm.name}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={addressForm.streetAddress}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={addressForm.postalCode}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={addressForm.country}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressChange}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Set as default shipping address
                  </span>
                </label>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md flex items-center"
                disabled={loading.address}
              >
                {loading.address ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : editingAddressId ? (
                  "Update Address"
                ) : (
                  "Add Address"
                )}
              </button>
              <button
                type="button"
                onClick={() => handleCancel("address")}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {/* Address List */}
        {user?.addresses && user.addresses.length > 0 ? (
          <div className="space-y-4">
            {user.addresses.map((address) => (
              <div
                key={address._id}
                className={`p-4 border rounded-md ${
                  address.isDefault ? "border-black" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{address.name}</h3>
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <address className="text-sm text-gray-600 not-italic mt-1">
                      {address.streetAddress}
                      <br />
                      {address.city}, {address.state} {address.postalCode}
                      <br />
                      {address.country}
                    </address>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="text-sm text-gray-600 hover:text-black mr-2"
                    >
                      <Pencil size={14} />
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="text-sm text-red-500 hover:text-red-700"
                        disabled={loading.deleteAddress === address._id}
                      >
                        {loading.deleteAddress === address._id ? (
                          <svg
                            className="animate-spin h-3 w-3 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <X size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefaultAddress(address._id)}
                    className="text-xs text-black underline mt-2"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No shipping addresses saved yet.</p>
            <button
              onClick={handleAddAddress}
              className="mt-2 text-black underline"
            >
              Add your first address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
