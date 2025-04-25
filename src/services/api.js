// /* eslint-disable import/no-anonymous-default-export */
// // src/services/api.js
// import axios from "axios";

// // Get API base URL from environment variables or use default
// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// // Create axios instance with default config
// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add interceptor to include auth token in requests
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["x-auth-token"] = token;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Handle response errors globally
// apiClient.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     // Handle specific error codes
//     if (error.response) {
//       // Server responded with non-2xx status
//       console.error("API Error:", error.response.data);

//       // If unauthorized, clear local auth data
//       if (error.response.status === 401) {
//         authService.clearAuthData();
//       }

//       // Return the error message from the server if available
//       if (error.response.data && error.response.data.message) {
//         return Promise.reject({
//           message: error.response.data.message,
//           status: error.response.status,
//           response: error.response.data,
//         });
//       }
//     }

//     // Generic error or network error
//     return Promise.reject({
//       message: error.message || "An unexpected error occurred",
//       status: error.response?.status || 0,
//     });
//   }
// );

// // Authentication Service
// export const authService = {
//   // Register a new user
//   async register(userData) {
//     try {
//       const response = await apiClient.post("/auth/register", userData);
//       this.setAuthData(response);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Login with email and password
//   async login(credentials) {
//     try {
//       const response = await apiClient.post("/auth/login", credentials);
//       this.setAuthData(response);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Login with Google
//   async googleLogin(tokenId) {
//     try {
//       const response = await apiClient.post("/auth/google", { tokenId });
//       this.setAuthData(response);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Set authentication data in local storage
//   setAuthData(data) {
//     if (data.token) {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//     }
//   },

//   // Get current user from local storage
//   getCurrentUser() {
//     const userStr = localStorage.getItem("user");
//     if (userStr) {
//       try {
//         return JSON.parse(userStr);
//       } catch (e) {
//         return null;
//       }
//     }
//     return null;
//   },

//   // Check if user is authenticated
//   isAuthenticated() {
//     return !!localStorage.getItem("token");
//   },

//   // Get auth token
//   getToken() {
//     return localStorage.getItem("token");
//   },

//   // Set token manually (used for token refresh)
//   setToken(token) {
//     if (token) {
//       localStorage.setItem("token", token);
//     }
//   },

//   // Clear auth data from local storage
//   clearAuthData() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     // Trigger storage event for other tabs
//     window.dispatchEvent(new Event("storage"));
//   },

//   // Logout
//   logout() {
//     this.clearAuthData();
//   },
// };

// // User Service
// export const userService = {
//   // Get user profile
//   async getProfile() {
//     try {
//       return await apiClient.get("/user/profile");
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update user profile
//   async updateProfile(profileData) {
//     try {
//       return await apiClient.put("/user/profile", profileData);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update email
//   async updateEmail(emailData) {
//     try {
//       const response = await apiClient.put("/user/email", emailData);
//       if (response.token) {
//         authService.setToken(response.token);
//       }
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update password
//   async updatePassword(passwordData) {
//     try {
//       return await apiClient.put("/user/password", passwordData);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Delete account
//   async deleteAccount() {
//     try {
//       await apiClient.delete("/user");
//       authService.clearAuthData();
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get addresses
//   async getAddresses() {
//     try {
//       return await apiClient.get("/user/addresses");
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Add new address
//   async addAddress(addressData) {
//     try {
//       return await apiClient.post("/user/addresses", addressData);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update address
//   async updateAddress(addressId, addressData) {
//     try {
//       return await apiClient.put(`/user/addresses/${addressId}`, addressData);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Delete address
//   async deleteAddress(addressId) {
//     try {
//       return await apiClient.delete(`/user/addresses/${addressId}`);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Set default address
//   async setDefaultAddress(addressId) {
//     try {
//       return await apiClient.put(`/user/addresses/${addressId}/default`);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get payment methods
//   async getPaymentMethods() {
//     try {
//       return await apiClient.get("/user/payment-methods");
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Add payment method
//   async addPaymentMethod(paymentData) {
//     try {
//       return await apiClient.post("/user/payment-methods", paymentData);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Delete payment method
//   async deletePaymentMethod(paymentId) {
//     try {
//       return await apiClient.delete(`/user/payment-methods/${paymentId}`);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Set default payment method
//   async setDefaultPaymentMethod(paymentId) {
//     try {
//       return await apiClient.put(`/user/payment-methods/${paymentId}/default`);
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// // Cart Service
// export const cartService = {
//   // Get cart
//   async getCart() {
//     try {
//       return await apiClient.get("/cart");
//     } catch (error) {
//       // Return empty cart on error to avoid breaking the UI
//       console.error("Failed to fetch cart:", error);
//       return { items: [], subtotal: 0, itemCount: 0 };
//     }
//   },

//   // Add item to cart
//   async addToCart(cartItem) {
//     try {
//       return await apiClient.post("/cart", cartItem);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update cart item
//   async updateCartItem(itemId, quantity) {
//     try {
//       return await apiClient.put(`/cart/${itemId}`, { quantity });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Remove item from cart
//   async removeFromCart(itemId) {
//     try {
//       return await apiClient.delete(`/cart/${itemId}`);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Clear cart
//   async clearCart() {
//     try {
//       return await apiClient.delete("/cart");
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// // Wishlist Service
// export const wishlistService = {
//   // Get wishlist
//   async getWishlist() {
//     try {
//       return await apiClient.get("/wishlist");
//     } catch (error) {
//       // Return empty wishlist on error to avoid breaking the UI
//       console.error("Failed to fetch wishlist:", error);
//       return { items: [], count: 0 };
//     }
//   },

//   // Add to wishlist
//   async addToWishlist(productId) {
//     try {
//       return await apiClient.post("/wishlist", { productId });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Remove from wishlist
//   async removeFromWishlist(productId) {
//     try {
//       return await apiClient.delete(`/wishlist/${productId}`);
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// // Order Service
// export const orderService = {
//   // Get all orders
//   async getOrders(params = {}) {
//     try {
//       return await apiClient.get("/orders", { params });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get single order
//   async getOrder(orderId) {
//     try {
//       return await apiClient.get(`/orders/${orderId}`);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Create order
//   async createOrder(orderData) {
//     try {
//       return await apiClient.post("/orders", orderData);
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// // Product Service
// export const productService = {
//   // Get all products with filters
//   async getProducts(params = {}) {
//     try {
//       return await apiClient.get("/products", { params });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get single product
//   async getProduct(productId) {
//     try {
//       return await apiClient.get(`/products/${productId}`);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get new arrivals
//   async getNewArrivals(params = {}) {
//     try {
//       // Add featured filter to params
//       const queryParams = { ...params, featured: true };
//       return await apiClient.get("/products/new-arrivals", {
//         params: queryParams,
//       });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Modify the getTopSelling function in src/services/api.js
//   async getTopSelling(params = {}) {
//     try {
//       // Add trending filter to params
//       const queryParams = { ...params, trending: true };
//       return await apiClient.get("/products/top-selling", {
//         params: queryParams,
//       });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Search products
//   async searchProducts(query) {
//     try {
//       return await apiClient.get("/products/search", { params: { q: query } });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Add these to the productService in src/services/api.js

//   // Get product reviews
//   async getProductReviews(productId) {
//     try {
//       return await apiClient.get(`/products/${productId}/reviews`);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Add a review
//   async addProductReview(productId, reviewData) {
//     try {
//       return await apiClient.post(`/products/${productId}/reviews`, reviewData);
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Delete a review
//   async deleteProductReview(productId, reviewId) {
//     try {
//       return await apiClient.delete(
//         `/products/${productId}/reviews/${reviewId}`
//       );
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// // Category Service
// export const categoryService = {
//   // Get all categories
//   async getCategories() {
//     try {
//       return await apiClient.get("/categories");
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get products by category
//   async getCategoryProducts(categoryName, params = {}) {
//     try {
//       return await apiClient.get(`/categories/${categoryName}/products`, {
//         params,
//       });
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// export default {
//   authService,
//   userService,
//   cartService,
//   wishlistService,
//   orderService,
//   productService,
//   categoryService,
// };
