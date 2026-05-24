/* eslint-disable import/no-anonymous-default-export */
// src/services/api.js
import axios from "axios";

// Get API base URL from environment variables or use default
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      if (error.response.status === 401) {
        authService.clearAuthData();
      }

      if (error.response.data && error.response.data.message) {
        return Promise.reject({
          message: error.response.data.message,
          status: error.response.status,
          response: error.response.data,
        });
      }
    }

    return Promise.reject({
      message: error.message || "An unexpected error occurred",
      status: error.response?.status || 0,
    });
  },
);

// Authentication Service
export const authService = {
  async register(userData) {
    try {
      const response = await apiClient.post("/auth/register", userData);
      this.setAuthData(response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      this.setAuthData(response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async googleLogin(tokenId) {
    try {
      const response = await apiClient.post("/auth/google", { tokenId });
      this.setAuthData(response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Set authentication data in local storage
  setAuthData(data) {
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Notify same-tab listeners (storage event only fires in OTHER tabs)
      window.dispatchEvent(new Event("authChange"));
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  setToken(token) {
    if (token) {
      localStorage.setItem("token", token);
    }
  },

  // Clear auth data from local storage
  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Notify all tabs
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("authChange"));
  },

  logout() {
    this.clearAuthData();
  },
};

// User Service
export const userService = {
  async getProfile() {
    try {
      return await apiClient.get("/user/profile");
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(profileData) {
    try {
      return await apiClient.put("/user/profile", profileData);
    } catch (error) {
      throw error;
    }
  },

  async updateEmail(emailData) {
    try {
      const response = await apiClient.put("/user/email", emailData);
      if (response.token) {
        authService.setToken(response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  async updatePassword(passwordData) {
    try {
      return await apiClient.put("/user/password", passwordData);
    } catch (error) {
      throw error;
    }
  },

  async deleteAccount() {
    try {
      await apiClient.delete("/user");
      authService.clearAuthData();
    } catch (error) {
      throw error;
    }
  },

  async getAddresses() {
    try {
      return await apiClient.get("/user/addresses");
    } catch (error) {
      throw error;
    }
  },

  async addAddress(addressData) {
    try {
      return await apiClient.post("/user/addresses", addressData);
    } catch (error) {
      throw error;
    }
  },

  async updateAddress(addressId, addressData) {
    try {
      return await apiClient.put(`/user/addresses/${addressId}`, addressData);
    } catch (error) {
      throw error;
    }
  },

  async deleteAddress(addressId) {
    try {
      return await apiClient.delete(`/user/addresses/${addressId}`);
    } catch (error) {
      throw error;
    }
  },

  async setDefaultAddress(addressId) {
    try {
      return await apiClient.put(`/user/addresses/${addressId}/default`);
    } catch (error) {
      throw error;
    }
  },

  async getPaymentMethods() {
    try {
      return await apiClient.get("/user/payment-methods");
    } catch (error) {
      throw error;
    }
  },

  async addPaymentMethod(paymentData) {
    try {
      return await apiClient.post("/user/payment-methods", paymentData);
    } catch (error) {
      throw error;
    }
  },

  async deletePaymentMethod(paymentId) {
    try {
      return await apiClient.delete(`/user/payment-methods/${paymentId}`);
    } catch (error) {
      throw error;
    }
  },

  async setDefaultPaymentMethod(paymentId) {
    try {
      return await apiClient.put(`/user/payment-methods/${paymentId}/default`);
    } catch (error) {
      throw error;
    }
  },
};

// Cart Service
export const cartService = {
  async getCart() {
    try {
      return await apiClient.get("/cart");
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      return { items: [], subtotal: 0, itemCount: 0 };
    }
  },

  async addToCart(cartItem) {
    try {
      return await apiClient.post("/cart", cartItem);
    } catch (error) {
      throw error;
    }
  },

  async updateCartItem(itemId, quantity) {
    try {
      return await apiClient.put(`/cart/${itemId}`, { quantity });
    } catch (error) {
      throw error;
    }
  },

  async removeFromCart(itemId) {
    try {
      return await apiClient.delete(`/cart/${itemId}`);
    } catch (error) {
      throw error;
    }
  },

  async clearCart() {
    try {
      return await apiClient.delete("/cart");
    } catch (error) {
      throw error;
    }
  },
};

// Wishlist Service
export const wishlistService = {
  async getWishlist() {
    try {
      return await apiClient.get("/wishlist");
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      return { items: [], count: 0 };
    }
  },

  async addToWishlist(productId) {
    try {
      return await apiClient.post("/wishlist", { productId });
    } catch (error) {
      throw error;
    }
  },

  async removeFromWishlist(productId) {
    try {
      return await apiClient.delete(`/wishlist/${productId}`);
    } catch (error) {
      throw error;
    }
  },
};

// Order Service
export const orderService = {
  async getOrders(params = {}) {
    try {
      return await apiClient.get("/orders", { params });
    } catch (error) {
      throw error;
    }
  },

  async getOrder(orderId) {
    try {
      return await apiClient.get(`/orders/${orderId}`);
    } catch (error) {
      throw error;
    }
  },

  async createOrder(orderData) {
    try {
      return await apiClient.post("/orders", orderData);
    } catch (error) {
      throw error;
    }
  },
};

// Product Service
export const productService = {
  async getProducts(params = {}) {
    try {
      return await apiClient.get("/products", { params });
    } catch (error) {
      throw error;
    }
  },

  async getProduct(productId) {
    try {
      return await apiClient.get(`/products/${productId}`);
    } catch (error) {
      throw error;
    }
  },

  async getNewArrivals(params = {}) {
    try {
      const queryParams = { ...params, featured: true };
      return await apiClient.get("/products/new-arrivals", {
        params: queryParams,
      });
    } catch (error) {
      throw error;
    }
  },

  async getTopSelling(params = {}) {
    try {
      const queryParams = { ...params, trending: true };
      return await apiClient.get("/products/top-selling", {
        params: queryParams,
      });
    } catch (error) {
      throw error;
    }
  },

  async searchProducts(query) {
    try {
      return await apiClient.get("/products/search", { params: { q: query } });
    } catch (error) {
      throw error;
    }
  },

  async getProductReviews(productId) {
    try {
      return await apiClient.get(`/products/${productId}/reviews`);
    } catch (error) {
      throw error;
    }
  },

  async addProductReview(productId, reviewData) {
    try {
      return await apiClient.post(`/products/${productId}/reviews`, reviewData);
    } catch (error) {
      throw error;
    }
  },

  async deleteProductReview(productId, reviewId) {
    try {
      return await apiClient.delete(
        `/products/${productId}/reviews/${reviewId}`,
      );
    } catch (error) {
      throw error;
    }
  },
};

// Category Service
export const categoryService = {
  async getCategories() {
    try {
      return await apiClient.get("/categories");
    } catch (error) {
      throw error;
    }
  },

  async getCategoryProducts(categoryName, subcategoryName = null, params = {}) {
    try {
      const endpoint = subcategoryName
        ? `/categories/${categoryName}/${subcategoryName}/products`
        : `/categories/${categoryName}/products`;
      return await apiClient.get(endpoint, { params });
    } catch (error) {
      throw error;
    }
  },
};

export const ReviewClient = {
  async getReviews(params = {}) {
    try {
      const response = await apiClient.get("/reviews", { params });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
};

export default {
  authService,
  userService,
  cartService,
  wishlistService,
  orderService,
  productService,
  categoryService,
  ReviewClient,
};
