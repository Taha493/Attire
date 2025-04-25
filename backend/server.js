// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ==== MODELS ====

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google sign-in
  googleId: { type: String },
  profilePicture: { type: String },
  phone: { type: String },
  created: { type: Date, default: Date.now },
  addresses: [
    {
      name: { type: String, required: true }, // E.g., "Home", "Work"
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
    },
  ],
  paymentMethods: [
    {
      type: { type: String, required: true }, // E.g., "credit", "paypal"
      cardBrand: { type: String },
      lastFour: { type: String },
      expiryMonth: { type: Number },
      expiryYear: { type: Number },
      isDefault: { type: Boolean, default: false },
    },
  ],
});

const User = mongoose.model("User", userSchema);

// Product Schema
// Update the Product Schema in server.js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discountPercentage: { type: Number },
  imageSrc: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  subcategory: { type: String },
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  sizes: [{ type: String }],
  colors: [
    {
      name: { type: String, required: true },
      hex: { type: String, required: true },
    },
  ],
  sku: { type: String, required: true },
  material: { type: String },
  trending: { type: Boolean, default: false },
  bestRated: { type: Boolean, default: false },
  mostPopular: { type: Boolean, default: false },
  featured: { type: Boolean, default: false }, // Added featured field
  createdAt: { type: Date, default: Date.now },
  // Add reviews array to the product schema
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
      verified: { type: Boolean, default: false },
    },
  ],
});

productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) return 0;

  const totalRating = this.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  return totalRating / this.reviews.length;
};

// Pre-save hook to update rating and reviewCount
productSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    this.rating = this.calculateAverageRating();
    this.reviewCount = this.reviews.length;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  imageSrc: { type: String },
  type: { type: String }, // E.g., "gender", "dress-style", "product-type"
  productCount: { type: Number, default: 0 },
});

const Category = mongoose.model("Category", categorySchema);

// Cart Schema
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
      size: { type: String, required: true },
      color: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

cartSchema.methods.calculateTotals = function () {
  let subtotal = 0;
  this.items.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  return {
    subtotal,
    itemCount: this.items.length,
  };
};

const Cart = mongoose.model("Cart", cartSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      imageSrc: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      size: { type: String, required: true },
      color: { type: String, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  shippingAddress: {
    name: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  billingAddress: {
    name: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "pending" }, // pending, paid, refunded
  status: { type: String, default: "processing" }, // processing, shipped, delivered, cancelled
  trackingNumber: { type: String },
  trackingURL: { type: String },
  estimatedDelivery: { type: Date },
  deliveredDate: { type: Date },
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  dateAdded: { type: Date, default: Date.now },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

// Review Schema
const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
});

const Review = mongoose.model("Review", reviewSchema);

// JWT Token Generation
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Auth middleware to protect routes
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// ==== AUTH ROUTES ====

// Email/Password Registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create empty cart and wishlist for the user
    const newCart = new Cart({ user: newUser._id, items: [] });
    await newCart.save();

    const newWishlist = new Wishlist({ user: newUser._id, products: [] });
    await newWishlist.save();

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Email/Password Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Google Authentication
app.post("/api/auth/google", async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new User({
        name,
        email,
        googleId,
        profilePicture: picture,
      });

      await user.save();

      // Create empty cart and wishlist for the user
      const newCart = new Cart({ user: user._id, items: [] });
      await newCart.save();

      const newWishlist = new Wishlist({ user: user._id, products: [] });
      await newWishlist.save();
    } else {
      // Update Google ID if user exists but hasn't used Google login before
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = picture;
        await user.save();
      }
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==== USER ROUTES ====

// Get User Profile
app.get("/api/user/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update User Profile
app.put("/api/user/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Email
app.put("/api/user/email", authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Verify password
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
    }

    // Update email
    user.email = email;
    await user.save();

    // Generate new token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Email update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Password
app.put("/api/user/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password if it exists
    if (user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid current password" });
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Account
app.delete("/api/user", authMiddleware, async (req, res) => {
  try {
    // Delete user and associated data
    await User.findByIdAndDelete(req.user.id);
    await Cart.findOneAndDelete({ user: req.user.id });
    await Wishlist.findOneAndDelete({ user: req.user.id });
    // Could also delete orders, reviews, etc.

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Addresses
app.get("/api/user/addresses", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.addresses);
  } catch (error) {
    console.error("Addresses fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add Address
app.post("/api/user/addresses", authMiddleware, async (req, res) => {
  try {
    const { name, streetAddress, city, state, postalCode, country, isDefault } =
      req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new address
    const newAddress = {
      name,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      isDefault,
    };

    // If this is the default address, unset other default addresses
    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    // Add new address
    user.addresses.push(newAddress);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    console.error("Address add error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Address
app.put("/api/user/addresses/:addressId", authMiddleware, async (req, res) => {
  try {
    const { name, streetAddress, city, state, postalCode, country, isDefault } =
      req.body;
    const addressId = req.params.addressId;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find address
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If this is the default address, unset other default addresses
    if (isDefault && !address.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update address
    address.name = name;
    address.streetAddress = streetAddress;
    address.city = city;
    address.state = state;
    address.postalCode = postalCode;
    address.country = country;
    address.isDefault = isDefault;

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    console.error("Address update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Address
app.delete(
  "/api/user/addresses/:addressId",
  authMiddleware,
  async (req, res) => {
    try {
      const addressId = req.params.addressId;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find address
      const address = user.addresses.id(addressId);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      // Can't delete default address
      if (address.isDefault) {
        return res
          .status(400)
          .json({ message: "Cannot delete default address" });
      }

      // Remove address
      user.addresses.pull(addressId);
      await user.save();

      res.json(user.addresses);
    } catch (error) {
      console.error("Address delete error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Set Default Address
app.put(
  "/api/user/addresses/:addressId/default",
  authMiddleware,
  async (req, res) => {
    try {
      const addressId = req.params.addressId;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find address
      const address = user.addresses.id(addressId);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      // Set this address as default and unset others
      user.addresses.forEach((addr) => {
        addr.isDefault = addr._id.toString() === addressId;
      });

      await user.save();

      res.json(user.addresses);
    } catch (error) {
      console.error("Set default address error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get Payment Methods
app.get("/api/user/payment-methods", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.paymentMethods);
  } catch (error) {
    console.error("Payment methods fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add Payment Method
app.post("/api/user/payment-methods", authMiddleware, async (req, res) => {
  try {
    const { type, cardBrand, lastFour, expiryMonth, expiryYear, isDefault } =
      req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new payment method
    const newPaymentMethod = {
      type,
      cardBrand,
      lastFour,
      expiryMonth,
      expiryYear,
      isDefault,
    };

    // If this is the default payment method, unset other defaults
    if (isDefault) {
      user.paymentMethods.forEach((method) => {
        method.isDefault = false;
      });
    }

    // Add new payment method
    user.paymentMethods.push(newPaymentMethod);
    await user.save();

    res.json(user.paymentMethods);
  } catch (error) {
    console.error("Payment method add error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Payment Method
app.delete(
  "/api/user/payment-methods/:paymentId",
  authMiddleware,
  async (req, res) => {
    try {
      const paymentId = req.params.paymentId;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find payment method
      const paymentMethod = user.paymentMethods.id(paymentId);
      if (!paymentMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }

      // Can't delete default payment method
      if (paymentMethod.isDefault) {
        return res
          .status(400)
          .json({ message: "Cannot delete default payment method" });
      }

      // Remove payment method
      user.paymentMethods.pull(paymentId);
      await user.save();

      res.json(user.paymentMethods);
    } catch (error) {
      console.error("Payment method delete error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Set Default Payment Method
app.put(
  "/api/user/payment-methods/:paymentId/default",
  authMiddleware,
  async (req, res) => {
    try {
      const paymentId = req.params.paymentId;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find payment method
      const paymentMethod = user.paymentMethods.id(paymentId);
      if (!paymentMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }

      // Set this payment method as default and unset others
      user.paymentMethods.forEach((method) => {
        method.isDefault = method._id.toString() === paymentId;
      });

      await user.save();

      res.json(user.paymentMethods);
    } catch (error) {
      console.error("Set default payment method error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ==== PRODUCT ROUTES ====

// ==== PRODUCT ROUTES ====

// Get new arrivals
app.get("/api/products/new-arrivals", async (req, res) => {
  try {
    const { limit = 4, filter, featured = true } = req.query;

    // Build query
    const query = { featured: featured === "true" };

    // Add filter
    if (filter) {
      query.gender = filter;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(products);
  } catch (error) {
    console.error("New arrivals fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get top selling products
app.get("/api/products/top-selling", async (req, res) => {
  try {
    const { limit = 4, filter, trending = true } = req.query;

    // Build query
    const query = { trending: trending === "true" };

    // Add additional filter types if needed
    if (filter === "trending") {
      query.trending = true;
    } else if (filter === "best-rated") {
      query.bestRated = true;
    } else if (filter === "most-popular") {
      query.mostPopular = true;
    }

    const products = await Product.find(query)
      .sort({ rating: -1 })
      .limit(Number(limit));

    res.json(products);
  } catch (error) {
    console.error("Top selling products fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all products with filtering, sorting, and pagination
app.get("/api/products", async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sizes,
      colors,
      sort,
      page = 1,
      limit = 10,
      search,
    } = req.query;

    // Build query
    const query = {};

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Add sizes filter
    if (sizes) {
      const sizeArray = sizes.split(",");
      query.sizes = { $in: sizeArray };
    }

    // Add colors filter
    if (colors) {
      const colorArray = colors.split(",");
      query["colors.name"] = { $in: colorArray };
    }

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case "price-asc":
          sortOption = { price: 1 };
          break;
        case "price-desc":
          sortOption = { price: -1 };
          break;
        case "newest":
          sortOption = { createdAt: -1 };
          break;
        case "rating":
          sortOption = { rating: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    // Apply pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    // Get total count
    const totalProducts = await Product.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(totalProducts / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNumber,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single product by ID
app.get("/api/products/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search products
app.get("/api/products/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    }).limit(20);

    res.json(products);
  } catch (error) {
    console.error("Product search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get product reviews
app.get("/api/products/:productId/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate({
      path: "reviews.user",
      select: "name profilePicture",
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product.reviews);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a review to a product
app.post(
  "/api/products/:productId/reviews",
  authMiddleware,
  async (req, res) => {
    try {
      const { rating, text } = req.body;

      // Validate input
      if (!rating || !text) {
        return res
          .status(400)
          .json({ message: "Rating and review text are required" });
      }

      // Find the product
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if user already reviewed this product
      const existingReviewIndex = product.reviews.findIndex(
        (review) => review.user && review.user.toString() === req.user.id
      );

      // Get user info
      const user = await User.findById(req.user.id);

      if (existingReviewIndex >= 0) {
        // Update existing review
        product.reviews[existingReviewIndex].rating = rating;
        product.reviews[existingReviewIndex].text = text;
        product.reviews[existingReviewIndex].date = Date.now();
      } else {
        // Add new review
        product.reviews.push({
          user: req.user.id,
          userName: user.name,
          rating,
          text,
          date: Date.now(),
          // Check if user has purchased the product
          verified: await Order.exists({
            user: req.user.id,
            "items.product": req.params.productId,
            status: "delivered",
          }),
        });
      }

      // Recalculate average rating
      product.rating = product.calculateAverageRating();
      product.reviewCount = product.reviews.length;

      await product.save();

      res.json(product.reviews);
    } catch (error) {
      console.error("Error adding product review:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a review
app.delete(
  "/api/products/:productId/reviews/:reviewId",
  authMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Find the review
      const reviewIndex = product.reviews.findIndex(
        (review) => review._id.toString() === req.params.reviewId
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check if the review belongs to the user (or user is admin)
      if (product.reviews[reviewIndex].user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this review" });
      }

      // Remove the review
      product.reviews.splice(reviewIndex, 1);

      // Recalculate rating
      product.rating = product.calculateAverageRating();
      product.reviewCount = product.reviews.length;

      await product.save();

      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting product review:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ==== CATEGORY ROUTES ====

// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get products by category
app.get("/api/categories/:categoryName/products", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const {
      minPrice,
      maxPrice,
      sizes,
      colors,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = { category: categoryName };

    // Add price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Add sizes filter
    if (sizes) {
      const sizeArray = sizes.split(",");
      query.sizes = { $in: sizeArray };
    }

    // Add colors filter
    if (colors) {
      const colorArray = colors.split(",");
      query["colors.name"] = { $in: colorArray };
    }

    // Build sort
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case "price-asc":
          sortOption = { price: 1 };
          break;
        case "price-desc":
          sortOption = { price: -1 };
          break;
        case "newest":
          sortOption = { createdAt: -1 };
          break;
        case "rating":
          sortOption = { rating: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    // Apply pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    // Get total count
    const totalProducts = await Product.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(totalProducts / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNumber,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Category products fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==== CART ROUTES ====

// Get cart
app.get("/api/cart", authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select: "name imageSrc price originalPrice discountPercentage inStock",
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    // Calculate totals
    const totals = cart.calculateTotals();

    res.json({
      items: cart.items,
      ...totals,
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add item to cart
app.post("/api/cart", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    // Validate quantity
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.inStock) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    // Find cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if product already exists in cart with same size and color
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex !== -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.price,
      });
    }

    // Update cart timestamp
    cart.updatedAt = Date.now();
    await cart.save();

    // Get updated cart with populated product info
    cart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name imageSrc price originalPrice discountPercentage inStock",
    });

    // Calculate totals
    const totals = cart.calculateTotals();

    res.json({
      items: cart.items,
      ...totals,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update cart item
app.put("/api/cart/:itemId", authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    // Validate quantity
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find item in cart
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update quantity
    item.quantity = quantity;

    // Update cart timestamp
    cart.updatedAt = Date.now();
    await cart.save();

    // Get updated cart with populated product info
    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name imageSrc price originalPrice discountPercentage inStock",
    });

    // Calculate totals
    const totals = updatedCart.calculateTotals();

    res.json({
      items: updatedCart.items,
      ...totals,
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
app.delete("/api/cart/:itemId", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find item in cart
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove item
    cart.items.pull(itemId);

    // Update cart timestamp
    cart.updatedAt = Date.now();
    await cart.save();

    // Get updated cart with populated product info
    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name imageSrc price originalPrice discountPercentage inStock",
    });

    // Calculate totals
    const totals = updatedCart.calculateTotals();

    res.json({
      items: updatedCart.items,
      ...totals,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Clear cart
app.delete("/api/cart", authMiddleware, async (req, res) => {
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear items
    cart.items = [];

    // Update cart timestamp
    cart.updatedAt = Date.now();
    await cart.save();

    // Calculate totals
    const totals = cart.calculateTotals();

    res.json({
      items: [],
      ...totals,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==== ORDER ROUTES ====

// Get all orders for user
app.get("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Add status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Apply pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query
    const orders = await Order.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Get total count
    const totalOrders = await Order.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(totalOrders / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.json({
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: pageNumber,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single order
app.get("/api/orders/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Order fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create order
app.post("/api/orders", authMiddleware, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      discount,
      tax,
      total,
    } = req.body;

    // Validate required fields
    if (!items || !shippingAddress || !billingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new order
    const newOrder = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      discount,
      tax,
      total,
      status: "processing",
      paymentStatus: "paid",
      date: Date.now(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    });

    await newOrder.save();

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], updatedAt: Date.now() }
    );

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==== WISHLIST ROUTES ====

// Get wishlist
app.get("/api/wishlist", authMiddleware, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: "products",
      select:
        "name imageSrc price originalPrice discountPercentage rating reviewCount inStock category",
    });

    // Create wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
      await wishlist.save();

      // Return empty wishlist
      return res.json({ items: [], count: 0 });
    }

    // Format response with additional metadata
    const wishlistItems = wishlist.products.map((product) => ({
      id: product._id,
      name: product.name,
      imageSrc: product.imageSrc,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      category: product.category,
      dateAdded: wishlist.dateAdded,
    }));

    res.json({
      items: wishlistItems,
      count: wishlistItems.length,
    });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add to wishlist
app.post("/api/wishlist", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }

    // Check if product is already in wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add product to wishlist
    wishlist.products.push(productId);
    wishlist.dateAdded = Date.now();
    await wishlist.save();

    // Get updated wishlist with populated product info
    wishlist = await Wishlist.findById(wishlist._id).populate({
      path: "products",
      select:
        "name imageSrc price originalPrice discountPercentage rating reviewCount inStock category",
    });

    // Format response
    const wishlistItems = wishlist.products.map((product) => ({
      id: product._id,
      name: product.name,
      imageSrc: product.imageSrc,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      category: product.category,
      dateAdded: wishlist.dateAdded,
    }));

    res.json({
      items: wishlistItems,
      count: wishlistItems.length,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from wishlist
app.delete("/api/wishlist/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    // Find wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Check if product is in wishlist
    if (!wishlist.products.includes(productId)) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    // Get updated wishlist with populated product info
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: "products",
      select:
        "name imageSrc price originalPrice discountPercentage rating reviewCount inStock category",
    });

    // Format response
    const wishlistItems = updatedWishlist.products.map((product) => ({
      id: product._id,
      name: product.name,
      imageSrc: product.imageSrc,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      category: product.category,
      dateAdded: updatedWishlist.dateAdded,
    }));

    res.json({
      items: wishlistItems,
      count: wishlistItems.length,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
