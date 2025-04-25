// src/components/user/NotificationsPage.js
import React, { useState, useEffect } from "react";
import {
  Bell,
  BellOff,
  ShoppingBag,
  Tag,
  Truck,
  Heart,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      orderUpdates: true,
      promotions: true,
      productAlerts: false,
      accountActivity: true,
    },
    push: {
      orderUpdates: true,
      promotions: false,
      productAlerts: true,
      accountActivity: false,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications and settings
    const fetchNotificationsData = async () => {
      setLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // This would be real API calls in production
        // const notificationsResponse = await fetch('/api/user/notifications');
        // const settingsResponse = await fetch('/api/user/notification-settings');
        // const notificationsData = await notificationsResponse.json();
        // const settingsData = await settingsResponse.json();

        // Mock notification data
        const mockNotifications = [
          {
            id: "notif1",
            type: "order",
            title: "Order Shipped",
            message:
              "Your order #ORD-123456 has been shipped and is on its way.",
            date: "2025-04-18T10:30:00Z",
            read: false,
            actionLink: "/profile/orders/ORD-123456",
          },
          {
            id: "notif2",
            type: "promotion",
            title: "Spring Sale",
            message:
              "Enjoy 30% off all spring collection items. Sale ends in 3 days!",
            date: "2025-04-15T08:15:00Z",
            read: true,
            actionLink: "/category/Sale",
          },
          {
            id: "notif3",
            type: "product",
            title: "Item Back in Stock",
            message:
              "The Vertical Striped Shirt you wishlisted is now back in stock!",
            date: "2025-04-10T14:45:00Z",
            read: true,
            actionLink: "/product/vertical-striped-shirt",
          },
          {
            id: "notif4",
            type: "account",
            title: "Password Updated",
            message: "The password for your account was successfully updated.",
            date: "2025-04-05T12:30:00Z",
            read: true,
            actionLink: null,
          },
          {
            id: "notif5",
            type: "order",
            title: "Order Delivered",
            message: "Your order #ORD-789012 has been delivered.",
            date: "2025-04-01T16:20:00Z",
            read: true,
            actionLink: "/profile/orders/ORD-789012",
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching notifications data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationsData();
  }, []);

  // Handle notification read status change
  const markAsRead = (notificationId) => {
    // This would be an API call in a real application
    // const response = await fetch(`/api/user/notifications/${notificationId}/read`, {
    //   method: 'PUT'
    // });

    // Update local state
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    // This would be an API call in a real application
    // const response = await fetch('/api/user/notifications/read-all', {
    //   method: 'PUT'
    // });

    // Update local state
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );

    toast.success("All notifications marked as read");
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    // This would be an API call in a real application
    // const response = await fetch('/api/user/notifications/clear-all', {
    //   method: 'DELETE'
    // });

    // Update local state
    setNotifications([]);

    toast.success("All notifications cleared");
  };

  // Toggle notification setting
  const toggleNotificationSetting = (channel, setting) => {
    // This would be an API call in a real application
    // const response = await fetch('/api/user/notification-settings', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     channel,
    //     setting,
    //     value: !notificationSettings[channel][setting]
    //   }),
    // });

    // Update local state
    setNotificationSettings({
      ...notificationSettings,
      [channel]: {
        ...notificationSettings[channel],
        [setting]: !notificationSettings[channel][setting],
      },
    });

    toast.success("Notification setting updated");
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5; // Convert ms to hours

    if (diffInHours < 24) {
      // Less than 24 hours, show relative time
      if (diffInHours < 1) {
        const minutes = Math.round(diffInHours * 60);
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
      } else {
        const hours = Math.round(diffInHours);
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
      }
    } else if (diffInHours < 48) {
      // Less than 48 hours, show "Yesterday"
      return "Yesterday";
    } else {
      // More than 48 hours, show date
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag size={18} className="text-blue-500" />;
      case "promotion":
        return <Tag size={18} className="text-purple-500" />;
      case "product":
        return <Heart size={18} className="text-red-500" />;
      case "shipping":
        return <Truck size={18} className="text-green-500" />;
      case "account":
        return <CheckCircle size={18} className="text-indigo-500" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        {/* Notifications Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="font-medium">
            Recent Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm">
            {notifications.length > 0 && (
              <>
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </button>
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={clearAllNotifications}
                >
                  Clear all
                </button>
              </>
            )}
          </div>
        </div>

        {/* Notifications Content */}
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 flex ${
                  notification.read ? "bg-white" : "bg-blue-50"
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                  if (notification.actionLink) {
                    // In a real app, navigate to the action link
                    console.log(`Navigate to: ${notification.actionLink}`);
                    // navigate(notification.actionLink);
                  }
                }}
              >
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-sm">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  {notification.actionLink && (
                    <div className="mt-2">
                      <a
                        href={notification.actionLink}
                        className="text-xs text-black underline"
                      >
                        {notification.type === "order"
                          ? "View Order Details"
                          : notification.type === "product"
                          ? "View Product"
                          : notification.type === "promotion"
                          ? "Shop Now"
                          : "View Details"}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center bg-gray-100 w-16 h-16 rounded-full mb-4">
              <BellOff size={24} className="text-gray-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">No notifications</h2>
            <p className="text-sm text-gray-500">
              You don't have any notifications at this time.
            </p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-4">Notification Settings</h2>

        <div className="mb-6">
          <h3 className="font-medium text-sm mb-3">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Account Activity</div>
                <div className="text-xs text-gray-500">
                  Get notified about important account activities
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.email.accountActivity}
                  onChange={() =>
                    toggleNotificationSetting("email", "accountActivity")
                  }
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm mb-3">Push Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Order Updates</div>
                <div className="text-xs text-gray-500">
                  Receive updates about your orders
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.push.orderUpdates}
                  onChange={() =>
                    toggleNotificationSetting("push", "orderUpdates")
                  }
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Promotions</div>
                <div className="text-xs text-gray-500">
                  Receive push notifications about sales and promotions
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.push.promotions}
                  onChange={() =>
                    toggleNotificationSetting("push", "promotions")
                  }
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Product Alerts</div>
                <div className="text-xs text-gray-500">
                  Get push notifications when wishlist items are back in stock
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.push.productAlerts}
                  onChange={() =>
                    toggleNotificationSetting("push", "productAlerts")
                  }
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Account Activity</div>
                <div className="text-xs text-gray-500">
                  Get push notifications about important account activities
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.push.accountActivity}
                  onChange={() =>
                    toggleNotificationSetting("push", "accountActivity")
                  }
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
