// src/components/user/AccountSettings.js - Updated version with API integration
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { userService, authService } from "../../services/api";

const AccountSettings = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailForm, setEmailForm] = useState({
    email: user?.email || "",
    password: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [loading, setLoading] = useState({
    email: false,
    password: false,
    deleteAccount: false,
  });

  // Handle email form change
  const handleEmailFormChange = (e) => {
    const { name, value } = e.target;
    setEmailForm({
      ...emailForm,
      [name]: value,
    });
  };

  // Handle password form change
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  // Handle update email
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, email: true });

    try {
      // Validate form
      if (!emailForm.email || !emailForm.password) {
        toast.error("Please fill in all fields");
        setLoading({ ...loading, email: false });
        return;
      }

      // Update email
      const response = await userService.updateEmail(emailForm);

      toast.success("Email updated successfully");
      setIsEditingEmail(false);
      setEmailForm({
        email: emailForm.email,
        password: "",
      });

      // Since email has changed, update auth token (if returned in response)
      if (response && response.token) {
        authService.setToken(response.token);
      }

      // Otherwise, re-authenticate by logging out
      else {
        setTimeout(() => {
          authService.logout();
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Email update error:", error);
      toast.error(error.message || "Failed to update email");
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  // Handle update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, password: true });

    try {
      // Validate form
      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        toast.error("Please fill in all fields");
        setLoading({ ...loading, password: false });
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error("New passwords do not match");
        setLoading({ ...loading, password: false });
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        setLoading({ ...loading, password: false });
        return;
      }

      // Update password
      await userService.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password updated successfully");
      setIsEditingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, deleteAccount: true });

    try {
      // Validate confirmation
      if (deleteConfirmation !== "DELETE") {
        toast.error("Please type DELETE to confirm");
        setLoading({ ...loading, deleteAccount: false });
        return;
      }

      // Delete account
      await userService.deleteAccount();

      toast.success("Account deleted successfully");

      // Log out and redirect to home page
      authService.logout();
      navigate("/");
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setLoading({ ...loading, deleteAccount: false });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {/* Email Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold">Email Address</h2>
            <p className="text-sm text-gray-500">
              Update your email address. A verification email will be sent to
              the new address.
            </p>
          </div>
          {!isEditingEmail && (
            <button
              className="text-sm text-gray-600 hover:text-black"
              onClick={() => setIsEditingEmail(true)}
            >
              Edit
            </button>
          )}
        </div>

        {isEditingEmail ? (
          <form onSubmit={handleUpdateEmail}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                New Email Address
              </label>
              <input
                type="email"
                name="email"
                value={emailForm.email}
                onChange={handleEmailFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Confirm with Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="password"
                  value={emailForm.password}
                  onChange={handleEmailFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} className="text-gray-500" />
                  ) : (
                    <Eye size={16} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md flex items-center"
                disabled={loading.email}
              >
                {loading.email ? (
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
                    Updating...
                  </>
                ) : (
                  "Update Email"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingEmail(false);
                  setEmailForm({
                    email: user?.email || "",
                    password: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm">{user?.email}</div>
        )}
      </div>

      {/* Password Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold">Password</h2>
            <p className="text-sm text-gray-500">
              Change your password. We recommend using a strong, unique password
              that you don't use elsewhere.
            </p>
          </div>
          {!isEditingPassword && (
            <button
              className="text-sm text-gray-600 hover:text-black"
              onClick={() => setIsEditingPassword(true)}
            >
              Change Password
            </button>
          )}
        </div>

        {isEditingPassword ? (
          <form onSubmit={handleUpdatePassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} className="text-gray-500" />
                  ) : (
                    <Eye size={16} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff size={16} className="text-gray-500" />
                  ) : (
                    <Eye size={16} className="text-gray-500" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} className="text-gray-500" />
                  ) : (
                    <Eye size={16} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md flex items-center"
                disabled={loading.password}
              >
                {loading.password ? (
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
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingPassword(false);
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm">••••••••</div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account by requiring a
              verification code when you sign in.
            </p>
          </div>
          <button className="text-sm text-gray-600 hover:text-black">
            Enable
          </button>
        </div>
        <div className="text-sm">
          Two-factor authentication is currently disabled.
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-red-600">Delete Account</h2>
            <p className="text-sm text-gray-500">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          {!isDeleting && (
            <button
              className="text-sm text-red-600 hover:text-red-700"
              onClick={() => setIsDeleting(true)}
            >
              Delete Account
            </button>
          )}
        </div>

        {isDeleting && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-600 mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone and will permanently delete all your data including
              order history, saved items, and preferences.
            </p>

            <form onSubmit={handleDeleteAccount}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
                  disabled={
                    deleteConfirmation !== "DELETE" || loading.deleteAccount
                  }
                >
                  {loading.deleteAccount ? (
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
                      Deleting...
                    </>
                  ) : (
                    "Permanently Delete Account"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleting(false);
                    setDeleteConfirmation("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
